class CustomResponse {
    constructor(status, data) {
        this.timestamp = new Date();
        this.status = status;
        this.data = data || [];
    }

    static ok(data) {
        return new CustomResponse(200, data);
    }

    static created(data) {
        return new CustomResponse(201, data);
    }
}

module.exports = CustomResponse;