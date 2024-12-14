import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Select, Input, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import ManagerLayout from './ManagerLayout';
import AssetModal from './Dashboard/AssetModal';
import EquipmentActions from './Dashboard/EquipmentActions';
import './YardLayout.css';
import axios from 'axios';

