var renderer;
var scene;
var status;
var camera;
var meshlist=[];//メッシュの格納リスト
var Anamorlist = []; //objectの格納リスト
var rWidth;//rendererの横のサイズ
var rHeight;//rendererの縦のサイズ
var boneActor;//アナモルフォーズの骨(頂点と面だけのデータ)

//setupメソッド
function setup(width,height) {
  // stats
    statsInit();

    console.log("setup");
    // (1)レンダラの初期化
    renderer = new THREE.WebGLRenderer({ antialias:true });
    // var rWidth=1000;//rendererの横のサイズ
    // var rHeight=750;//rendererの縦のサイズ
    rWidth=width;//rendererの横のサイズ
    rHeight=height;//rendererの縦のサイズ
    renderer.setSize(rWidth, rHeight);
    renderer.setClearColorHex(0x000000, 1);
    document.body.appendChild(renderer.domElement);

     // objX=rWidth/2;//objectのX位置初期化
     // objY=rHeight/2;//objectのY位置初期化
        
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

    //(5)オブジェクトの生成
    boneActor = makeBone();

    //stage準備OK
    console.log("Finish setting of renderer, scene, camera, and light.");
    console.log("Stage stand-by OK.");
}

//アナモルフォーズの骨組みを作る(頂点データと面データ)
function makeBone(){
    console.log("makeBone");
    var geometry = new THREE.Geometry();
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
            //使う頂点の中にnullがなければテクスチャを貼り付ける
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
 

    // (5-5)他のデータを自動計算
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    return geometry;
}


//meshのタッチクリック操作を付け加えるメソッド
function addActorAction(){

	var i=0;

	//タッチイベントをサポートしているか調べる
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
            meshlist[i].position.x=(moveX/rWidth)*2-1;
            meshlist[i].position.y=-(moveY/rHeight)*2+1;
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
            var radian = Math.atan2(heigt,width);
            meshlist[i].rotation.z = radian;


            //X軸, Y軸共に -1 ~ 1 の間に収まるよう調整し、その位置に移動
            meshlist[i].position.x=(moveX/rWidth)*2-1;
            meshlist[i].position.y=-(moveY/rHeight)*2+1;
        });

    }else{
        console.log("タッチイベントに未対応");
        //click Event
        renderer.domElement.addEventListener('click', function(e){
            var mouseX = e.pageX-renderer.domElement.offsetLeft;
            var mouseY = e.pageY-renderer.domElement.offsetTop;

            //X軸, Y軸共に -1 ~ 1 の間に収まるよう調整し、その位置に移動
            meshlist[i].position.x=(mouseX/rWidth)*2-1;
            meshlist[i].position.y=-(mouseY/rHeight)*2+1;

            //回転を求める
            var heigt=(mouseX/rWidth)*2-1;
            var width=-(mouseY/rHeight)*2+1;
            var rr=Math.sqrt(width*width+heigt*heigt);
            console.log("heigt:"+heigt);
            console.log("rr:"+rr/heigt);
            console.log("rotation:"+rr/heigt);
            console.log("rotation:"+Math.atan2(heigt,width));
            // meshlist[i].rotation.z=Math.atan2(heigt,width);
            var radian = Math.atan2(heigt,width);
            meshlist[i].rotation.z = radian;
            
         
            console.log("clickX:"+mouseX);
            console.log("clickY:"+mouseY);
            console.log("click");
        });
    }



 //click Event
        // renderer.domElement.addEventListener('click', function(e){
            // var mouseX = e.pageX-renderer.domElement.offsetLeft;
            // var mouseY = e.pageY-renderer.domElement.offsetTop;

            // //X軸, Y軸共に -1 ~ 1 の間に収まるよう調整し、その位置に移動
            // meshlist[i].position.x=(mouseX/rWidth)*2-1;
            // meshlist[i].position.y=-(mouseY/rHeight)*2+1;

            // //回転を求める
            // var heigt=(mouseX/rWidth)*2-1;
            // var width=-(mouseY/rHeight)*2+1;
            // var rr=Math.sqrt(width*width+heigt*heigt);
            // console.log("heigt:"+heigt);
            // console.log("rr:"+rr/heigt);
            // console.log("rotation:"+rr/heigt);
            // console.log("rotation:"+Math.atan2(heigt,width));
            // meshlist[i].rotation.z=Math.atan2(heigt,width);
            
         
            // console.log("clickX:"+mouseX);
            // console.log("clickY:"+mouseY);
            // console.log("click");

            // var mouseX = e.pageX-renderer.domElement.offsetLeft;
            // var mouseY = e.pageY-renderer.domElement.offsetTop;

            // //X軸, Y軸共に -1 ~ 1 の間に収まるよう調整し、その位置に移動
            // mouseX=(mouseX/rWidth)*2-1;
            // mouseY=-(mouseY/rHeight)*2+1;

            // // マウスの位置ベクトル
            // var pos = new THREE.Vector3(mouseX, mouseY, 1);

            // pos はスクリーン座標系なので、オブジェクトの座標系に変換
            // オブジェクト座標系は今表示しているカメラからの視点なので、第二引数にカメラオブジェクトを渡す
            // new THREE.Projector.unprojectVector(pos, camera); ↓最新版では以下の方法で得る
            // pos.unproject(camera);

            // // 始点、向きベクトルを渡してレイを作成
            // var ray = new THREE.Raycaster(camera.position, pos.sub(camera.position).normalize());

            // // 交差判定
            // // 引数は取得対象となるMeshの配列を渡す。以下はシーン内のすべてのオブジェクトを対象に。
            // var objs = ray.intersectObjects(scene.children);

            // //ヒエラルキーを持った子要素も対象とする場合は第二引数にtrueを指定する
            // //var objs = ray.intersectObjects(scene.children, true);

            // if (obj.length > 0) {
            //     // 交差していたらobjsが1以上になるので、やりたいことをやる。
            //     objs[0].object.position.x = mouseX;
            //     objs[0].object.position.y = mouseY;
            // }
        // });


}

//オブジェクト、およびメッシュリストを追加する
function addActor(video){
	//オブジェクトの生成
	var Anamor = new AnamorClass(boneActor,video);
	Anamorlist.push(Anamor);
	//メッシュの作成
	// var Mesh = Anamor.makeAnamorObj();
    var Mesh = Anamor.mappingVideo();
	meshlist.push(Mesh);
	scene.add(Mesh);
	addActorAction();//タッチクリック操作をつける。


    Anamorlist[0].changeTexture();
    Anamorlist[0].changeVideo();
	
	//render
	render();
}

//videoが十分なデータをもっているか
function howVideoState(){
	var flag=0;

	for(var n=0;n<Anamorlist.length;n++){
		if(!Anamorlist[n].videoStatus()){
			flag++;
		}
	}

	return flag==0;//すべてのvideoは十分な状態だったか？
}

//すべてのvideoデータを更新
function reloadVideo(){
	for(var n=0;n<Anamorlist.length;n++){
		Anamorlist[n].reloadTexture();
	}	
}



//render メソッド
function render() {
	if(howVideoState()) {
		reloadVideo();
		renderer.render(scene, camera);
    }
    //status 更新
    stats.update();

    requestAnimationFrame(render);

}

//statusInit メソッド
function statsInit() {
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = "143px";
  stats.domElement.style.zIndex = 100;
  document.body.appendChild( stats.domElement );
}