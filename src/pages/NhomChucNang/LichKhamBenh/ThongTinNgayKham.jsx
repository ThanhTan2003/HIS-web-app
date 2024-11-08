import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getToken } from '../../../services/localStorageService';
import { CONFIG } from '../../../configurations/configuration';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons';

export default function ThongTinNgayKham() {
    const navigate = useNavigate();
    const { day } = useParams();
  return (
    <div>ThongTinNgayKham + {day}</div>
  )
}
