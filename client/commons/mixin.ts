import * as moment from 'moment';


const mixin = {
    filters: {
        myFormatDate(date: any) {
            return moment(date).format('YYYY-MM-DD HH:mm:ss');
        }
    }
};

export default mixin;