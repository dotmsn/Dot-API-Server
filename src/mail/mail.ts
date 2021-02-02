export default class Mail {
    public from: string;
    public to: string;
    public body: string;
    public subject: string;

    constructor({ from, to, body, subject }) {
        this.from = from;
        this.to = to;
        this.body = body;
        this.subject = subject;
    }

    public toJSON(): Record<string, string> {
        return {
            from: this.from,
            to: this.to,
            html: this.body,
            subject: this.subject,
        };
    }
}
