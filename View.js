        var videoTexture, videoMaterial;//objactテクスチャ
        var renderer;
        var scene;
        var video;
        var mesh = [];

        var stats;

 
        //２乗か否かを調べる。
        // function isPowerOfTwo(x) {
        //     return (x & (x - 1)) == 0;
        // }





// function SetVideo(anothervideo){
//     console.log("SetVideo");
//     console.log("anothervideo:"+anothervideo);
//     statsInit();
//             // if(!isPowerOfTwo(anothervideo.videoWidth)||
//             //         !isPowerOfTwo(anothervideo.videoHeight)){//videoのサイズはべき乗か
//             //     //リサイズ処理
//             //     console.log("resize please.");
//             // }

//     video=anothervideo;
// }

function addAnamerObj(pvideo){
    var geometry = new THREE.Geometry();
    // (5-2)頂点データの作成
    var uvs = [];
    var nullary = [];
    MathAnamor(0.6,3.0,5.0);//(半径、視点Y、視点Z)
    for(var y = 0 ; y <= 64 ; y++) {
        for(var x = 0 ; x <= 64 ; x++) {
        var Plot=MathDot(x / 32 - 1,y / 32 - 1);
        if(isNaN(Plot.x)){//値がNullの物をNullリスト登録
                      nullary.push(x + y * 65);
                    }
        geometry.vertices.push(
        new THREE.Vector3(
        Plot.x/2,
        Plot.y/2,
        0.0));
        uvs.push(
             new THREE.UV(x / 64, y / 64));
        }
    }
      
    // (5-3)面データの作成
    for(var y = 0 ; y < 64 ; y++) {
        for(var x = 0 ; x < 64 ; x++) {
        var b = x + y * 65;
        var m = (x + y) & 1;
            //四角の頂点のうちどれか一つでもnullの値があれば表示しない
            if(nullary.indexOf(b)==-1 
                && nullary.indexOf(b+1)==-1 
                && nullary.indexOf(b+65)==-1 
                && nullary.indexOf(b+66)==-1){
                   geometry.faces.push(
                        new THREE.Face3(b + 0, b +  1, b + 65, null, null, 0),
                        new THREE.Face3(b + 1, b + 66, b + 65, null, null, 0));
                   geometry.faceVertexUvs[0].push(
                       [uvs[b + 0], uvs[b +  1], uvs[b + 65]],
                       [uvs[b + 1], uvs[b + 66], uvs[b + 65]]);
               }
        }
    }
 

    // make video texture
    pvideoTexture = new THREE.Texture(pvideo);
    pvideoTexture.minFilter = THREE.LinearFilter;
    pvideoTexture.magFilter = THREE.LinearFilter;
    pvideoTexture.format = THREE.RGBFormat;
    // geometry.materials=[new THREE.MeshBasicMaterial({
    //   map: videoTexture
    // })];
    //TV会議システムならば影を見る必要はないので、MeshBasicMaterialの方がいいかも

      geometry.materials = [
                new THREE.MeshPhongMaterial({
                    color: 0xffffff, specular: 0xffffff, shininess:50,
                    ambient: 0xffffff, side: THREE.DoubleSide, map: pvideoTexture }),
                new THREE.MeshPhongMaterial({
                    color: 0xcccccc, specular: 0x888888, shininess:50,
                    ambient: 0xcccccc, side: THREE.DoubleSide, map: pvideoTexture })];
      

 
      // (5-5)他のデータを自動計算
      geometry.computeFaceNormals();
      geometry.computeVertexNormals();
     
      // // (5-6)メッシュの作成
      var OneMesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial());

      mesh.push(OneMesh);//meshの追加



      //render  
    render();
}

function setup(firstvideo){
    video=firstvideo;
    // stats
    statsInit();

    console.log("setup");
    // (1)レンダラの初期化
    renderer = new THREE.WebGLRenderer({ antialias:true });
    // var rWidth=750;//rendererの横のサイズ
    var rWidth=1000;//rendererの横のサイズ
    var rHeight=750;//rendererの縦のサイズ
    renderer.setSize(rWidth, rHeight);
    renderer.setClearColorHex(0x000000, 1);
    document.body.appendChild(renderer.domElement);

     objX=rWidth/2;//objectのX位置初期化
     objY=rHeight/2;//objectのY位置初期化
        
    // (2)シーンの作成
    scene = new THREE.Scene();
 
    // (3)カメラの作成
    camera = new THREE.PerspectiveCamera(15, rWidth / rHeight);
    camera.position = new THREE.Vector3(0, 0, 8);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);
 
    // (4)ライトの作成
    var ambient = new THREE.AmbientLight(0xffffff);//環境光
    scene.add(ambient);
 
    // (5)表示する物体の作成
    // (5-1)形状オブジェクトの作成
      

    

    addAnamerObj(video);

 
    // // (5-2)頂点データの作成
    // var uvs = [];
    // var nullary = [];
    // MathAnamor(0.6,3.0,5.0);//(半径、視点Y、視点Z)
    // for(var y = 0 ; y <= 64 ; y++) {
    //     for(var x = 0 ; x <= 64 ; x++) {
    //     var Plot=MathDot(x / 32 - 1,y / 32 - 1);
    //     if(isNaN(Plot.x)){//値がNullの物をNullリスト登録
    //                   nullary.push(x + y * 65);
    //                 }
    //     geometry.vertices.push(
    //     new THREE.Vector3(
    //     Plot.x/2,
    //     Plot.y/2,
    //     0.0));
	   //  uvs.push(
		  //    new THREE.UV(x / 64, y / 64));
    //     }
    // }
      
    // // (5-3)面データの作成
    // for(var y = 0 ; y < 64 ; y++) {
    //     for(var x = 0 ; x < 64 ; x++) {
	   //  var b = x + y * 65;
	   //  var m = (x + y) & 1;
    //         //四角の頂点のうちどれか一つでもnullの値があれば表示しない
    //         if(nullary.indexOf(b)==-1 
    //             && nullary.indexOf(b+1)==-1 
    //             && nullary.indexOf(b+65)==-1 
    //             && nullary.indexOf(b+66)==-1){
	   //             geometry.faces.push(
				//         new THREE.Face3(b + 0, b +  1, b + 65, null, null, 0),
				//         new THREE.Face3(b + 1, b + 66, b + 65, null, null, 0));
	   //             geometry.faceVertexUvs[0].push(
				// 	   [uvs[b + 0], uvs[b +  1], uvs[b + 65]],
				// 	   [uvs[b + 1], uvs[b + 66], uvs[b + 65]]);
    //            }
    //     }
    // }
 

    // // make video texture
    // videoTexture = new THREE.Texture(video);
    // videoTexture.minFilter = THREE.LinearFilter;
    // videoTexture.magFilter = THREE.LinearFilter;
    // videoTexture.format = THREE.RGBFormat;
    // // geometry.materials=[new THREE.MeshBasicMaterial({
    // //   map: videoTexture
    // // })];
    // //TV会議システムならば影を見る必要はないので、MeshBasicMaterialの方がいいかも

    //   geometry.materials = [
			 //    new THREE.MeshPhongMaterial({
				//     color: 0xffffff, specular: 0xffffff, shininess:50,
				//     ambient: 0xffffff, side: THREE.DoubleSide, map: videoTexture }),
			 //    new THREE.MeshPhongMaterial({
				//     color: 0xcccccc, specular: 0x888888, shininess:50,
				//     ambient: 0xcccccc, side: THREE.DoubleSide, map: videoTexture })];
      

 
    //   // (5-5)他のデータを自動計算
    //   geometry.computeFaceNormals();
    //   geometry.computeVertexNormals();
     
    //   // // (5-6)メッシュの作成
    //   mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial());
      scene.add(mesh);

    var i=0;////仮

    // タッチイベントをサポートしているか調べる
    //対応してなければクリック対応
    if(window.TouchEvent){
        console.log("タッチイベントに対応");
        //Touch Event
        //移動
        renderer.domElement.addEventListener("touchstart", function(e){
            //中間値ベクトルの座標を求め、そこからレンダー自体の位置との差分を取る。
            var moveX=(e.touches[0].pageX+e.touches[1].pageX)/2-renderer.domElement.offsetLeft;
            var moveY=(e.touches[0].pageY+e.touches[1].pageY)/2-renderer.domElement.offsetTop;

            //X軸, Y軸共に -1 ~ 1 の間に収まるよう調整し、その位置に移動
            mesh[i].position.x=(moveX/rWidth)*2-1;
            mesh[i].position.y=-(moveY/rHeight)*2+1;
        });

        //回転
        renderer.domElement.addEventListener("touchmove", function(e){
            //回転の処理
            
            //中間値
            var Px=(e.touches[0].pageX+e.touches[1].pageX)/2;
            var Py=(e.touches[0].pageY+e.touches[1].pageY)/2;
            //中間値ベクトルの座標を求め、そこからレンダー自体の位置との差分を取る。
            var moveX=Px-renderer.domElement.offsetLeft;
            var moveY=Py-renderer.domElement.offsetTop;
            //回転を求める
            var heigt=Math.abs(e.touches[0].pageY-Py);
            var width=Math.abs(e.touches[0].pageX-Px);
            mesh[i].rotation.z=Math.atan2(heigt,width);


            //X軸, Y軸共に -1 ~ 1 の間に収まるよう調整し、その位置に移動
            mesh[i].position.x=(moveX/rWidth)*2-1;
            mesh[i].position.y=-(moveY/rHeight)*2+1;
        });

    }else{
        console.log("タッチイベントに未対応");
        //click Event
        renderer.domElement.addEventListener('click', function(e){
            var mouseX = e.pageX-renderer.domElement.offsetLeft;
            var mouseY = e.pageY-renderer.domElement.offsetTop;

            //X軸, Y軸共に -1 ~ 1 の間に収まるよう調整し、その位置に移動
            mesh[i].position.x=(mouseX/rWidth)*2-1;
            mesh[i].position.y=-(mouseY/rHeight)*2+1;

            //回転を求める
            var heigt=(mouseX/rWidth)*2-1;
            var width=-(mouseY/rHeight)*2+1;
            var rr=Math.sqrt(width*width+heigt*heigt);
            console.log("heigt:"+heigt);
            console.log("rr:"+rr/heigt);
            console.log("rotation:"+rr/heigt);
            console.log("rotation:"+Math.atan2(heigt,width));
            mesh.rotation.z=Math.atan2(heigt,width);
            
         
            console.log("clickX:"+mouseX);
            console.log("clickY:"+mouseY);
            console.log("click");
        });
    }
    

    //render  
    render();
}



 
// (6)レンダリング
function render() {
    if(video.readyState === video.HAVE_ENOUGH_DATA) {
	if(videoTexture) videoTexture.needsUpdate = true;
	
    renderer.render(scene, camera);//ここでエラーが起きてる
    }
    //status 更新
    stats.update();

    requestAnimationFrame(render);

}

function statsInit() {
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = "143px";
  stats.domElement.style.zIndex = 100;
  document.body.appendChild( stats.domElement );
}


