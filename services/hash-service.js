import { createHmac } from 'node:crypto'

class HashService {
    async hashOtp(data) {
        return await createHmac('sha256', process.env.HASH_SECRET).update(data).digest('hex')
    }
}

export default new HashService();