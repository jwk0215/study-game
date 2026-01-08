<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import * as THREE from "three";
    import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";




    // props
    let { props } = $props<{ props: {
        path: string;
        position: { x: number, y: number, z: number };
        looAt: { x: number, y: number, z: number };
        state: boolean;
        setLoadState: (state: boolean) => void;
    }}>();
    
    
    // three objects
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let hLight: THREE.HemisphereLight;
    let dLight: THREE.DirectionalLight;
    let mixer: THREE.AnimationMixer;
    let clock = new THREE.Clock();


    // animations
    let actions: Record<string, THREE.AnimationAction> = {};
    let currentAction: THREE.AnimationAction | null = null;
    let rafId: number;
    
    
    // state
    let viewerEl = $state<HTMLDivElement>();


    /**
     * GLB 파일 load
     * @param path string (파일 위치)
     */
    function loadModel(path: string) {
        return new Promise<GLTF>((resolve, reject) => {
            const loader = new GLTFLoader();
            loader.load(path, resolve, undefined, reject);
        });
    }


    /**
     * 애니메이션 루프 함수
     */
    function animate() {
        const delta = clock.getDelta();
        if (mixer) mixer.update(delta);
        renderer.render(scene, camera);
        rafId = requestAnimationFrame(animate);
    }


    /**
     * 애니메이션 변경
     * @param action THREE.AnimationAction
     */
    function playAction(action: THREE.AnimationAction) {
        if (!action) return;
        if (currentAction && currentAction === action) return;
        
        currentAction?.fadeOut(0.2);
        action.reset();
        action.setLoop(THREE.LoopRepeat, Infinity);
        action.clampWhenFinished = false;
        action.fadeIn(0.2);
        action.play();

        currentAction = action;
    }


    /**
     * onMount()
    */
    onMount(async () => {
        if (!viewerEl) return;
        
        scene = new THREE.Scene();
        scene.background = new THREE.Color("#FAFAF7");

        camera = new THREE.PerspectiveCamera(
            45,
            viewerEl.clientWidth / viewerEl.clientHeight,
            0.1,
            1000
        );
        camera.position.set(
            props.position.x,
            props.position.y,
            props.position.z
        );
        camera.lookAt(
            props.looAt.x,
            props.looAt.y,
            props.looAt.z
        );

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(viewerEl.clientWidth, viewerEl.clientHeight);
        viewerEl.appendChild(renderer.domElement);

        hLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
        hLight.position.set(0, 20, 0);
        scene.add(hLight);

        dLight = new THREE.DirectionalLight(0xffffff, 1);
        dLight.position.set(3, 10, 10);
        scene.add(dLight);

        const g = await loadModel(props.path);
        const model = g.scene;
        scene.add(model);
        
        mixer = new THREE.AnimationMixer(model);
        g.animations.forEach((clip) => {
            actions[clip.name] = mixer.clipAction(clip);
        });

        playAction(actions["idle"]);
        animate();

        setTimeout(() => {
            props.setLoadState(true);
        }, 300);
    });


    /**
     * onDestroy()
    */
    onDestroy(() => {
        cancelAnimationFrame(rafId);
        renderer?.dispose();
    });


    $effect(() => {
        if (props.state && actions["choice"]) playAction(actions["choice"]);
        if (!props.state && actions["idle"]) playAction(actions["idle"]);
    });
    // $effect(() => {
    //     console.log(props.state);
    //     if (props.state) actions["choice"]?.play();
    //     else actions["idle"]?.play();
    // });
</script>


<div id="viewer" bind:this={viewerEl}></div>


<style>
    #viewer {
        width: 100%;
        height: 100%;
    }
</style>