class CommonError{
    status=""
    message=""

    constructor(status,message){
        this.status=status;
        this.message=message;
    }
}

class ServerError extends CommonError{
    constructor(msg){
        super(500,msg);
    }
}

class ClientError extends CommonError{
    constructor(msg){
        super(400,msg);
    }
}

console.log(new ClientError("hi"))
