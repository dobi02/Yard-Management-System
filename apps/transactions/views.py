from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Transactions
from .serializers import TransactionsSerializer
from rest_framework.permissions import IsAuthenticated
from apps.drivers.models import Drivers


class TransactionsView(APIView):
    #permission_classes = [IsAuthenticated]
    def get(self, request):
        transactions = Transactions.objects.all()
        serializer = TransactionsSerializer(transactions, many=True)
        return Response(serializer.data)

    def post(self, request):
        request.data['driver_id'] = Drivers.objects.get(user__username=request.data['driver_id']).id
        request.data['status'] = "waiting"
        serializer = TransactionsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                #{"message": "Transaction created successfully.", "transaction_id": Transactions.transaction_id},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TransactionDetailView(APIView):
    #permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            transaction = Transactions.objects.get(pk=pk)
        except Transactions.DoesNotExist:
            return Response({"error": "Transaction not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = TransactionsSerializer(transaction)
        return Response(serializer.data)

    def put(self, request, pk):
        try:
            transaction = Transactions.objects.get(pk=pk)
        except Transactions.DoesNotExist:
            return Response({"error": "Transaction not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = TransactionsSerializer(transaction, data=request.data, partial=True)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data)
            except Exception as e:
                if request.data['transaction_status'] == "finished":
                    serializer = TransactionsSerializer(transaction, data={"transaction_status": "finished"}, partial=True)
                    if serializer.is_valid:
                        serializer.save()
                        return Response(serializer.data)
                print(e)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            transaction = Transactions.objects.get(pk=pk)
        except Transactions.DoesNotExist:
            return Response({"error": "Transaction not found"}, status=status.HTTP_404_NOT_FOUND)

        transaction.delete()
        return Response({"message": "Transaction deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


class TransactionsByDriverView(APIView):
    def get(self, request, driver_id):
        # Fetch transactions related to the driver_id
        try:
            transactions = (Transactions.objects.filter(driver_id__user__username=driver_id)
                            .exclude(transaction_status__in=["finished", "canceled"]))

        except Transactions.DoesNotExist:
            return Response({"message": "No transactions found for this driver."}, status=status.HTTP_404_NOT_FOUND)

        # Serialize the transactions
        serializer = TransactionsSerializer(transactions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class TransactionsDriverView(APIView):
    def put(self, request, pk, driver_id):
        try:
            transactions = Transactions.objects.get(pk=pk)
        except Transactions.DoesNotExist:
            return Response({"message": "Transaction not found."}, status=status.HTTP_404_NOT_FOUND)

        if request.data['transaction_status'] in ("accepted", "moving", "arrive", "finished", "canceled"):
            serializer = TransactionsSerializer(transactions, data=request.data, partial=True)
            try:
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
            except Exception as e:
                if request.data['transaction_status'] == "finished":
                    request.data['transaction_status'] = "arrive"
                    serializer = TransactionsSerializer(transactions, data=request.data, partial=True)
                    if serializer.is_valid():
                        serializer.save()
                        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
                print(e)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            return Response(status=status.HTTP_400_BAD_REQUEST)

