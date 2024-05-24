import { Schema, mongoose } from 'mongoose'

const MessageSchema = new Schema({
    text: {type: String, required: true},
    from: {type: String, required: true},
    sent: {type: Date}
})

const Message = mongoose.model('Message', MessageSchema)

export default Message