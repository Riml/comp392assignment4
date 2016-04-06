module config {
    export class Screen {
        static WIDTH:number = window.innerWidth;
        static HEIGHT:number = window.innerHeight;
        static RATIO:number = window.innerWidth / window.innerHeight;
    }
    
    // Scene Constants
    export class Scene {
        public static MENU: number = 0;
        public static TUTORIAL: number = 1;
        public static LEVEL1: number = 2;
        public static LEVEL2: number = 3;
        public static LEVEL3: number = 4;
        public static PLAY: number = 5;
        public static OVER: number = 6;
    }
    
}