function AnamorClass(boneGeometry,video){//コンストラクタ
    this.video=video;
    // this.geometry = new THREE.Geometry();
    this.geometry =boneGeometry;
    this.videoTexture = new THREE.Texture(video);
    this.videoTexture.minFilter = THREE.LinearFilter;
    this.videoTexture.magFilter = THREE.LinearFilter;
    this.videoTexture.format = THREE.RGBFormat;
}

//頂点データと面データがすでに備わっているgeometryをもらって、video貼り付けて返す
AnamorClass.prototype.mappingVideo = function(){
    console.log("mappingVideo");
    // this.geometry = boneGeometry;

    // this.videoTexture.minFilter = THREE.LinearFilter;
    // this.videoTexture.magFilter = THREE.LinearFilter;
    // this.videoTexture.format = THREE.RGBFormat;
    // geometry.materials=[new THREE.MeshBasicMaterial({
    //   map: videoTexture
    // })];
    //TV会議システムならば影を見る必要はないので、MeshBasicMaterialの方がいいかも

     this.geometry.materials = [
                new THREE.MeshPhongMaterial({
                    color: 0xffffff, specular: 0xffffff, shininess:50,
                    ambient: 0xffffff, side: THREE.DoubleSide, map: this.videoTexture }),
                new THREE.MeshPhongMaterial({
                    color: 0xcccccc, specular: 0x888888, shininess:50,
                    ambient: 0xcccccc, side: THREE.DoubleSide, map: this.videoTexture })];
      

      // // (5-6)メッシュの作成
      var mesh = new THREE.Mesh(this.geometry, new THREE.MeshFaceMaterial());
      return mesh;

}

// AnamorClass.prototype.makeAnamorObj = function(){

// 	// var geometry = new THREE.Geometry();
 
//     // (5-2)頂点データの作成
//     var uvs = [];
//     var nullary = [];
//     MathAnamor(0.6,3.0,5.0);//(半径、視点Y、視点Z)
//     for(var y = 0 ; y <= 64 ; y++) {
//         for(var x = 0 ; x <= 64 ; x++) {
//         var Plot=MathDot(x / 32 - 1,y / 32 - 1);
//         if(isNaN(Plot.x)){//値がNullの物をNullリスト登録
//                       nullary.push(x + y * 65);
//                     }
//         this.geometry.vertices.push(
//         new THREE.Vector3(
//         Plot.x/2,
//         Plot.y/2,
//         0.0));
// 	    uvs.push(
// 		     new THREE.UV(x / 64, y / 64));
//         }
//     }
      
//     // (5-3)面データの作成
//     for(var y = 0 ; y < 64 ; y++) {
//         for(var x = 0 ; x < 64 ; x++) {
// 	    var b = x + y * 65;
// 	    var m = (x + y) & 1;
// 	    	//使う頂点の中にnullがなければテクスチャを貼り付ける
//             if(nullary.indexOf(b)==-1 
//                 && nullary.indexOf(b+1)==-1 
//                 && nullary.indexOf(b+65)==-1 
//                 && nullary.indexOf(b+66)==-1){
// 	               this.geometry.faces.push(
// 				        new THREE.Face3(b + 0, b +  1, b + 65, null, null, 0),
// 				        new THREE.Face3(b + 1, b + 66, b + 65, null, null, 0));
// 	               this.geometry.faceVertexUvs[0].push(
// 					   [uvs[b + 0], uvs[b +  1], uvs[b + 65]],
// 					   [uvs[b + 1], uvs[b + 66], uvs[b + 65]]);
//                }
//         }
//     }
 

//     // (5-5)他のデータを自動計算
//       this.geometry.computeFaceNormals();
//       this.geometry.computeVertexNormals();

//     // make video texture
//     // videoTexture = new THREE.Texture(video);
//     this.videoTexture.minFilter = THREE.LinearFilter;
//     this.videoTexture.magFilter = THREE.LinearFilter;
//     this.videoTexture.format = THREE.RGBFormat;
//     // geometry.materials=[new THREE.MeshBasicMaterial({
//     //   map: videoTexture
//     // })];
//     //TV会議システムならば影を見る必要はないので、MeshBasicMaterialの方がいいかも

//       this.geometry.materials = [
// 			    new THREE.MeshPhongMaterial({
// 				    color: 0xffffff, specular: 0xffffff, shininess:50,
// 				    ambient: 0xffffff, side: THREE.DoubleSide, map: this.videoTexture }),
// 			    new THREE.MeshPhongMaterial({
// 				    color: 0xcccccc, specular: 0x888888, shininess:50,
// 				    ambient: 0xcccccc, side: THREE.DoubleSide, map: this.videoTexture })];
      

 
      
     
//       // // (5-6)メッシュの作成
//       var mesh = new THREE.Mesh(this.geometry, new THREE.MeshFaceMaterial());
//       return mesh;
// }


//videoがちゃんとデータが十分あるかを調べる
AnamorClass.prototype.videoStatus = function(){
	return this.video.readyState === this.video.HAVE_ENOUGH_DATA;
}

//videoの更新
AnamorClass.prototype.reloadTexture = function(){
	if(this.videoTexture) this.videoTexture.needsUpdate = true;
}
