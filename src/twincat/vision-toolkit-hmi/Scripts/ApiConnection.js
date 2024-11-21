class ApiConnection{      
    constructor(symbol = '%s%PLC1.MAIN.server.HandleRequest%/s%'){
        this.client = new TcHmiRpcClient(symbol);
    }
    async send(methodName, params) {
        try {

            const result = await this.client.rpcCall(methodName, params);
            return result;

        } catch (error) {
            throw error;
        }
    }
}
