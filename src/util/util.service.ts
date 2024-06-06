import { Injectable } from '@nestjs/common'
import { v4 } from 'uuid'

@Injectable()
export class UtilService {
  getUUID() {
    return v4()
  }
}
