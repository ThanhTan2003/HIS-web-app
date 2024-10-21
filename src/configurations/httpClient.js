import axios from "axios";
import { CONFIG } from "./configuration";

const httpClient = axios.create({
  baseURL: CONFIG.API_GATEWAY,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default httpClient;


//  Tệp này tạo ra một instance của Axios với các cấu hình cơ bản như baseURL và headers mặc định.

//  Tất cả các yêu cầu HTTP của ứng dụng sẽ đi qua httpClient, giúp dễ dàng quản lý các yêu cầu như cài đặt timeout và sử dụng cùng một cấu hình API Gateway​(httpClient).