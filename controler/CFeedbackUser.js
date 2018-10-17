"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const FeedbackUser_1 = require("../entity/FeedbackUser");
class CFeedbackUser {
    static siteGetAll(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield FeedbackUser_1.FeedbackUser.siteGetAll(siteId);
        });
    }
    static add(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let feedback = new FeedbackUser_1.FeedbackUser();
            feedback.content = info.content;
            feedback.user = info.user;
            feedback.site = info.site;
            return yield feedback.save();
        });
    }
    static update(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let feedback = yield FeedbackUser_1.FeedbackUser.findById(info.id);
            feedback.content = info.content;
            return yield feedback.save();
        });
    }
    static delById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield FeedbackUser_1.FeedbackUser.delById(id);
        });
    }
    static deal(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let feedback = yield FeedbackUser_1.FeedbackUser.findById(info.feedback.id);
            feedback.dealContent = info.dealContent;
            feedback.dealUser = info.dealUser;
            feedback.dealTime = info.dealTime;
            return yield feedback.save();
        });
    }
}
exports.CFeedbackUser = CFeedbackUser;
//# sourceMappingURL=CFeedbackUser.js.map