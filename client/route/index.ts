
import {RouteConfig} from "vue-router";
import HelloComponent from "../components/Hello.vue";
import HelloDecoratorComponent from "../components/HelloDecorator.vue";

const routes:Array<RouteConfig> = [
    {path: '/hello', component: HelloComponent},
    {path: '/hello/decorator', component: HelloDecoratorComponent}
];

export default routes;