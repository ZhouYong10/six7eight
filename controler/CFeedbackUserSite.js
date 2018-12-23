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
const FeedbackUserSite_1 = require("../entity/FeedbackUserSite");
const MessageBase_1 = require("../entity/MessageBase");
const MessageUserSite_1 = require("../entity/MessageUserSite");
class CFeedbackUserSite {
    static getWaitCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield FeedbackUserSite_1.FeedbackUserSite.getWaitCount();
        });
    }
    static getAll(page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield FeedbackUserSite_1.FeedbackUserSite.getAll(page);
        });
    }
    static getSiteAll(siteId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield FeedbackUserSite_1.FeedbackUserSite.getSiteAll(siteId, page);
        });
    }
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield FeedbackUserSite_1.FeedbackUserSite.findById(id);
        });
    }
    static add(info, io) {
        return __awaiter(this, void 0, void 0, function* () {
            let feedback = new FeedbackUserSite_1.FeedbackUserSite();
            feedback.content = info.content;
            feedback.user = info.user;
            feedback.site = info.site;
            feedback = yield feedback.save();
            io.emit('plusBadge', 'feedbackSitePlatform');
            io.emit('addSiteFeedback', feedback);
            return feedback;
        });
    }
    static update(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let feedback = yield FeedbackUserSite_1.FeedbackUserSite.findById(info.id);
            feedback.content = info.content;
            return yield feedback.save();
        });
    }
    static delById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield FeedbackUserSite_1.FeedbackUserSite.delById(id);
        });
    }
    static deal(info, io) {
        return __awaiter(this, void 0, void 0, function* () {
            let feedback = yield FeedbackUserSite_1.FeedbackUserSite.findById(info.feedback.id);
            feedback.isDeal = true;
            feedback.dealContent = info.dealContent;
            feedback.dealUser = info.dealUser;
            feedback.dealTime = info.dealTime;
            feedback = yield feedback.save();
            io.emit('minusBadge', 'feedbackSitePlatform');
            io.emit('dealSiteFeedback', feedback);
            let message = new MessageUserSite_1.MessageUserSite();
            message.user = feedback.user;
            message.title = MessageBase_1.MessageTitle.Feedback;
            message.content = feedback.dealContent;
            message.frontUrl = '/home/feedback/mine/manage';
            message.aimId = feedback.id;
            yield message.save();
            io.emit(feedback.user.id + 'plusMessageNum');
        });
    }
}
exports.CFeedbackUserSite = CFeedbackUserSite;
//# sourceMappingURL=CFeedbackUserSite.js.map