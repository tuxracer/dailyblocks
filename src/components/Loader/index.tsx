import { FunctionalComponent, h } from "preact";

export const Loader: FunctionalComponent = () => {
    return (
        <div class="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
};
