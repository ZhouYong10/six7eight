const components = {
    login: () => import("./login/Login.vue"),
    home: () => import("./Home.vue"),
    index: () => import("./Index.vue"),
    myInfo: () => import("./MyInfo.vue"),
    product: () => import("./Product.vue"),
    rechargeRecord: () => import("./recharge/RechargeRecord.vue"),
    consumeRecord: () => import("./ConsumeRecord.vue"),
    profitRecord: () => import("./ProfitRecord.vue"),
    withdraw: () => import("./Withdraw.vue"),
    withdrawRecord: () => import("./WithdrawRecord.vue"),
    lowerUsers: () => import("./LowerUsers.vue"),
    feedback: () => import("./Feedback.vue"),
};

export default components;