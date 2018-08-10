import * as moment from 'moment';
var mixin = {
    filters: {
        myFormatDate: function (date) {
            return moment(date).format('YYYY-MM-DD HH:mm:ss');
        }
    }
};
export default mixin;
//# sourceMappingURL=mixin.js.map