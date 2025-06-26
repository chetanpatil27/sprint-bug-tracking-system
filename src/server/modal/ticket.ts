import mongoose, { Document, Model, Schema } from "mongoose";

export interface ITicket extends Document {
    ticket_key: string;
    name: string;
    description?: string;
    type: 'Ticket' | 'bug' | 'story' | 'epic';
    priority: 'low' | 'medium' | 'high';
    status: 'todo' | 'inprogress' | 'done';
    project_id: mongoose.Types.ObjectId;
    assignee: mongoose.Types.ObjectId[];
    owner: mongoose.Types.ObjectId;
    comments: mongoose.Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}

const TicketSchema = new Schema<ITicket>(
    {
        ticket_key: { type: String, required: true },
        name: { type: String, required: true },
        description: { type: String },
        type: {
            type: String,
            enum: ['ticket', 'bug', 'story', 'epic'],
            required: true
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            required: true
        },
        status: {
            type: String,
            enum: ['todo', 'inprogress', 'done'],
            default: 'todo',
            required: true
        },
        project_id: { type: Schema.Types.ObjectId, ref: "Project", required: true },
        assignee: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
        comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
        owner: { type: Schema.Types.ObjectId, ref: "User", required: true }
    },
    { timestamps: true }
);

const Ticket: Model<ITicket> = mongoose.models.Ticket
    ? (mongoose.models.Ticket as Model<ITicket>)
    : mongoose.model<ITicket>("Ticket", TicketSchema);

export default Ticket;
