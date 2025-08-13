class ApiResponse{
    constructor(statusCode, data, message = "Sucsess")
    {
        this.data = data;
        this.message = message;
        this.statusCode = statusCode < 400
    }
}

export { ApiResponse };