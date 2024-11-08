import React, { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate, useParams, useLocation } from "react-router-dom";
import { getToken } from '../../../../services/localStorageService';
import { CONFIG } from '../../../../configurations/configuration';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft, faRotate, faMagnifyingGlass, faStethoscope, faVialVirus, faFileExcel, faFileLines } from '@fortawesome/free-solid-svg-icons';

import DanhSachDichVu from './DichVuBacSi/DanhSachDichVu';
import ThongTinBacSi from './DichVuBacSi/ThongTinBacSi';
import LichKhamBenh from './DichVuBacSi/LichKhamBenh';

export default function DichVuBacSi() {
    return (
        <div className="pt-2 pb-4 pl-4 pr-2">
            <ThongTinBacSi />
            <br /> <hr /> <br />
            <DanhSachDichVu />
            <br /> <hr /> <br />
            <LichKhamBenh />
        </div>
    )
}
