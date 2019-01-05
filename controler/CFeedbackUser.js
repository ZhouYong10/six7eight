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
const MessageBase_1 = require("../entity/MessageBase");
const MessageUser_1 = require("../entity/MessageUser");
const utils_1 = require("../utils");
class CFeedbackUser {
    static getWaitCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield FeedbackUser_1.FeedbackUser.getWaitCount();
        });
    }
    static getSiteWaitCount(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield FeedbackUser_1.FeedbackUser.getSiteWaitCount(siteId);
        });
    }
    static getAll(page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield FeedbackUser_1.FeedbackUser.getAll(page);
        });
    }
    static siteGetAll(siteId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield FeedbackUser_1.FeedbackUser.siteGetAll(siteId, page);
        });
    }
    static userGetAll(userId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield FeedbackUser_1.FeedbackUser.userGetAll(userId, page);
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield FeedbackUser_1.FeedbackUser.findByIdPlain(id);
        });
    }
    static add(info, io) {
        return __awaiter(this, void 0, void 0, function* () {
            let feedback = new FeedbackUser_1.FeedbackUser();
            feedback.content = info.content;
            feedback.user = info.user;
            feedback.site = info.site;
            feedback = yield feedback.save();
            io.emit(info.site.id + 'plusBadge', 'feedbackUserSite');
            io.emit('plusBadge', 'feedbackUserPlatform');
            io.emit(feedback.site.id + 'addFeedback', feedback);
            io.emit('addFeedback', feedback);
            return feedback;
        });
    }
    static update(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let feedback = yield FeedbackUser_1.FeedbackUser.findById(info.id);
            feedback.content = info.content;
            return yield feedback.save();
        });
    }
    static deal(info, io) {
        return __awaiter(this, void 0, void 0, function* () {
            let feedback = yield FeedbackUser_1.FeedbackUser.findById(info.feedback.id);
            utils_1.assert(!feedback.isDeal, '该条反馈已经处理了');
            feedback.isDeal = true;
            feedback.dealContent = info.dealContent;
            feedback.dealUserAdmin = info.dealUserAdmin;
            feedback.dealUserSite = info.dealUserSite;
            feedback.dealTime = info.dealTime;
            feedback = yield feedback.save();
            io.emit(feedback.site.id + 'minusBadge', 'feedbackUserSite');
            io.emit('minusBadge', 'feedbackUserPlatform');
            io.emit(feedback.site.id + 'dealFeedback', feedback);
            io.emit('dealFeedback', feedback);
            let message = new MessageUser_1.MessageUser();
            message.user = feedback.user;
            message.title = MessageBase_1.MessageTitle.Feedback;
            message.content = feedback.dealContent;
            message.frontUrl = '/feedback/records';
            message.aimId = feedback.id;
            yield message.save();
            io.emit(feedback.user.id + 'plusMessageNum');
        });
    }
}
exports.CFeedbackUser = CFeedbackUser;
//# sourceMappingURL=CFeedbackUser.js.map