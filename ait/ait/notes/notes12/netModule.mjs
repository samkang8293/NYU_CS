import { createServer } from 'net'
import { readFile } from 'fs/promises'

const server = createServer(sock => {
    sock.on('data', async data => {
        const [method, path, ...other] = (data + '').split(' ')
        console.log(method, path)
        const fileContent = await readFile(path.slice(1))
        sock.write('HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\n\r\n')
        sock.write(fileContent)
    })
    console.log('client connected')
})

server.listen(process.env.PORT ?? 3000)