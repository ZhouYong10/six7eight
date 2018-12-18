const components = {
    home: () => import("./Home.vue"),
    index: () => import("./Index.vue"),
    myInfo: () => import("./MyInfo.vue"),
    product: () => import("./Product.vue"),
    rechargeRecord: () => import("./recharge/RechargeRecord.vue"),
    fundsRecord: () => import("./FundsRecord.vue"),
    profitRecord: () => import("./ProfitRecord.vue"),
    withdrawRecord: () => import("./WithdrawRecord.vue"),
    roleUp: () => import("./RoleUp.vue"),
    lowerUsers: () => import("./LowerUsers.vue"),
    feedback: () => import("./Feedback.vue"),
};

export default components;