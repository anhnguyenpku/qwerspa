export const InputMask = {
    methods: {
        dealBlur(propName, data){
            let arr = String(data[propName]).split(".");
            data[propName] = arr[0].replace(/(\d)(?=(\d{3})+\b)/g,"$1,") + (arr[1] ? "."+ arr[1]:"")+" រៀល";
        },
        dealFocus(propName,data){
            data[propName] = String(data[propName]).replace(/[^\d\.]+/g,"");
        },
        resolveMask(val){
            return String(val).replace(/[^\d\.]+/g,"");
        }
    }
};