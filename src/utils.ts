import axios from 'axios';
import { ForbiddenException } from '@nestjs/common';

export const checkClientIpAddress = async (ip: string) => {
  const response = await axios.get(`https://ipapi.co/${ip}/country/`);
  if (response.data !== 'DE') {
    throw new ForbiddenException();
  }
};
