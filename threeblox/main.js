var camera, scene, renderer;
var geometry, material, mesh;
var move = true;
var v_velocity, h_velocity;
var meshes = [];
var count, chance;
var z_speed;
var score;
var START_CHANCE = 0.3;
var text_mesh;
var modifier;

var COLORS = [0xff0000, 0x00ff00];
var NUM_MESHES = 3000;
$('document').ready(function() {
  init();
  animate();
});

function resetValues() {
  camera.position.z = 1000;
  v_velocity = 0;
  h_velocity = 0;
  count = 0;
  score = 0;
  chance = 0.1;
  z_speed = 25;
  modifier = 0x000001;
}
function init() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    resetValues();
    scene = new THREE.Scene();
    fog = new THREE.Fog("#000000", 100, 3500);
    addText("Welcome to ThreeBlox!");
    for(i = 0; i < NUM_MESHES; i++) {
      geometry = new THREE.BoxGeometry(100, 100, 100);
      material = new THREE.MeshBasicMaterial({
          color: 0xFFFFFF,
          wireframe: false
      });
      mesh = new THREE.Mesh(geometry, material);
      moveMesh(mesh, true);
      meshes.push(mesh);
      scene.add(mesh);
    }

    scene.fog = fog;
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);
    var elem = localStorage.getItem("max_score");
    if(elem != null)
      document.getElementById("max_score").innerHTML = decode(elem);
    else {
      document.getElementById("max_score").innerHTML = 0;
      localStorage.setItem("max_score", encode(0));
    }
}

function moveMesh(mesh, intital) {
  if(Math.random() < chance) {
    mesh.position.x = Math.random() * 3000;
    mesh.position.y = Math.random() * 3000;
  }
  else {
    mesh.position.x = Math.random() * 5000;//window.innerWidth;
    mesh.position.y = Math.random() * 5000;//window.innerHeight;
  }
  var diffZ = Math.random() * 2000;
  if(intital)
    mesh.position.z = camera.position.z - diffZ - 500;
  else
    mesh.position.z = camera.position.z - diffZ - 3000;
  if(Math.random() < 0.5) {
    mesh.position.x = mesh.position.x * -1;
  }
  if(Math.random() < 0.5) {
    mesh.position.y = mesh.position.y * -1;
  }
  mesh.position.x = mesh.position.x + camera.position.x;
  mesh.position.y = mesh.position.y + camera.position.y;
}

function addText(text) {
  scene.remove(text_mesh);
  var shape = new THREE.TextGeometry(text, {font: 'helvetiker'});
  var wrapper = new THREE.MeshNormalMaterial({color: 0x00ff00});
  var words = new THREE.Mesh(shape, wrapper);
  words.position = camera.position;
  words.position.z -= 1000;
  words.position.x -= 150;
  text_mesh = words;
  scene.add(words);
}

function encode( str ) {
    return window.btoa(encodeURIComponent( escape( str )));
}

function decode( str ) {
    return unescape(decodeURIComponent(window.atob( str )));
}

function resetMeshes() {
  var max_score = decode(localStorage.getItem("max_score"));
  if(score > parseInt(max_score)) {
    addText("New High Score");
    localStorage.setItem("max_score", encode(score));
    document.getElementById("max_score").innerHTML = score;
  }
  else
    addText("Tough Luck!");
  resetValues();
  for(i = 0; i < meshes.length; i++) {
    meshes[i].material.color.setHex(0xFFFFFF);
    moveMesh(meshes[i], true);
  }
}

function collision(mesh, camera) {
  return (
    mesh.position.x - 50 < camera.position.x &&
    mesh.position.x + 50 > camera.position.x &&
    mesh.position.y - 50 < camera.position.y &&
    mesh.position.y + 50 > camera.position.y &&
    mesh.position.z - 50 < camera.position.z &&
    mesh.position.z + 50 > camera.position.z
  );
}

function outOfRange(mesh, camera) {
  return (
    (meshes[i].position.z - 100) > camera.position.z
  );
}

function animate() {
    if(count == 1000)
    {
      chance *= 1.5;
      count = 0;
      z_speed *= 1.1;
      //for(i = 0; i < meshes.length; i++)
        //meshes[i].material.color.setHex(COLORS[(score/1000) % COLORS.length]);
    }
    if(count % 100 === 0)
      modifier = modifier - 2;
    count += 1;
    h_velocity *= 0.98;
    v_velocity *= 0.98;
    score += 1;
    element = document.getElementById("score");
    if(element !== null)
      element.innerHTML = score;

    camera.position.x += h_velocity;
    camera.position.y += v_velocity;

    requestAnimationFrame(animate);
    for(i = 0; i < meshes.length; i++) {
      if((meshes[i].position.z - 100) > camera.position.z) {
        moveMesh(meshes[i], false);
      }
      else if(collision(meshes[i], camera)) {
        camera.position.z = 1000;
        resetMeshes();
      }
      //if(count % 4 === 0)
        //meshes[i].material.color.setHex(meshes[i].material.color.getHex() + modifier);
    }
    if(move) {
      camera.position.z -= z_speed;
    }
    renderer.render(scene, camera);

}

$("body").keydown(function(e) {
  if(e.keyCode == 87 || e.keyCode == 38) { // W
    if(v_velocity <= 20)
      v_velocity += 7;
  }
  if(e.keyCode == 83 || e.keyCode == 40) { // S
    if(v_velocity >= -20)
      v_velocity -= 7;
  }
  if(e.keyCode == 65 || e.keyCode == 37) { // A or left
    if(h_velocity >= -20)
      h_velocity -= 7;
  }
  if(e.keyCode == 68 || e.keyCode == 39) { // D
    if(h_velocity <= 20)
      h_velocity += 7;
  }
});
