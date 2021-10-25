// Nicolás Alongi, octubre de 2021

let inicio = 0;
let loops = true;
let colorGrilla = 0;
let fontSize = 20;

let organismo = {
  X: [],
  Y: [],
  index: -1,
  diametro: 1,
  margen: 2,
  historial: 100,
  color: 0,
  alcance: 8,
  transparencia: 100,

  // da origen a la primer célula
  nacer: function () {
    // asigna primer par de coordenadas a un punto aleatorio dentro de una grilla
    // definida por las dimensiones de la unidad mínima del organismo
    let origenX =
      Math.floor(Math.random() * Math.floor(width / this.diametro)) *
        this.diametro +
      this.diametro / 2;
    let origenY =
      Math.floor(Math.random() * Math.floor(height / this.diametro)) *
        this.diametro +
      this.diametro / 2;
    this.X.push(origenX);
    this.Y.push(origenY);
    this.index++;
  },

  // reproducción autónoma por radio de alcance de cada célula
  reproducir: function () {
    // se reproduce si hay otras células dentro del rango de la más reciente del array
    for (let i = 0; i < this.historial; i++) {
      let distanciaX = this.X[this.index] - this.X[this.index - i];
      let distanciaY = this.Y[this.index] - this.Y[this.index - i];

      if (
        distanciaX < (this.diametro + this.margen) * this.alcance &&
        distanciaY < (this.diametro + this.margen) * this.alcance
      ) {
        let nacimientoX =
          this.X[this.index] +
          this.diametro * (Math.round(Math.random() * 2) - 1);
        let nacimientoY =
          this.Y[this.index] +
          this.diametro * (Math.round(Math.random() * 2) - 1);

        // mantiene al organismo dentro de los límites de la ventana
        if (nacimientoX >= width - (this.diametro * width) / 100) {
          nacimientoX = width / 2;
        } else if (nacimientoX <= 0 + (this.diametro * width) / 100) {
          nacimientoX = width / 2;
        }

        if (nacimientoY >= height - (this.diametro * height) / 100) {
          nacimientoY = height / 2;
        } else if (nacimientoY <= 0 + (this.diametro * height) / 100) {
          nacimientoY = height / 2;
        }

        // agrega célula al array y la dibuja
        this.X.push(nacimientoX);
        this.Y.push(nacimientoY);
        this.index++;

        // selecciona perfil de color elegido al inicio
        if (colorGrilla == 3) {
          fill(181, 40, 40, this.transparencia);
          stroke(181, 40, 40, 5);
        } else {
          fill(this.color, this.transparencia);
          stroke(this.color, 5);
        }

        strokeWeight(4);
        rectMode(CENTER);
        rect(nacimientoX, nacimientoY, this.diametro);
      }
    }
  },
};

let estructura = {
  counter: 0,
  r: 255,
  g: 255,
  b: 255,
  gradient: 10,
  base: 150,
  tope: 255,
  velocidadDeDibujo: 20,

  // dibuja líneas cruzadas en X e Y según la ubicación del mouse
  grilla: function () {
    stroke(this.r, this.g, this.b);
    strokeWeight(organismo.diametro);

    if (this.counter == 0) {
      this.r = this.tope;
      this.g = this.tope;
      this.b = this.base;
    }

    // gradiente de tono atado a la cantidad de líneas dibujadas
    if (this.counter % this.velocidadDeDibujo == 0) {
      if (colorGrilla == 0) {
        if (this.r == this.tope && this.g != this.base) {
          this.g -= this.gradient;
          this.g = constrain(this.g, this.base, this.tope);
        } else if (this.r == this.tope && this.b != this.tope) {
          this.b += this.gradient;
          this.b = constrain(this.b, this.base, this.tope);
        } else if (this.r != this.base && this.g == this.base) {
          this.r -= this.gradient;
          this.r = constrain(this.r, this.base, this.tope);
        } else if (this.g != this.tope && this.b >= this.tope) {
          this.g += this.gradient;
          this.g = constrain(this.g, this.base, this.tope);
        } else if (this.r == this.base && this.b != this.base) {
          this.b -= this.gradient;
          this.b = constrain(this.b, this.base, this.tope);
        } else if (this.r != this.tope && this.g == this.tope) {
          this.r += this.gradient;
          this.r = constrain(this.r, this.base, this.tope);
        }
        // colores hardcodeados
      } else if (colorGrilla == 3) {
        this.r = 47;
        this.g = 47;
        this.b = 175;
      } else {
        this.r = 255;
        this.g = 0;
        this.b = 0;
      }

      line(mouseX, 0, mouseX, height);
      line(0, mouseY, width, mouseY);
    }

    this.counter++;
  },
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);

  fontSize = width / 40;
  fontSize = constrain(fontSize, 15, 30);
  textSize(fontSize);
  textAlign(CENTER, CENTER);

  slider = createSlider(1, 11, 6, 1);
  slider.position(0, 0);
  slider.style("width", "100%");
}

function draw() {
  // permite al usuario definir el tamaño de la célula con un slider
  organismo.diametro = slider.value();

  if (inicio == 0) {
    drawWords(width / 2);
  } else {
    organismo.reproducir();
    estructura.grilla();
  }
}

function mousePressed() {
  // da inicio al programa
  if (mouseY > width * 0.05) {
    if (inicio == 0) {
      background(255);
      if (mouseY < height / 2) {
        colorGrilla = 1;
      } else if (mouseY > height * 0.9) {
        colorGrilla = 3;
      }
    }

    slider.hide();
    organismo.nacer();
    inicio++;
  }
}

function keyPressed() {
  // pausa el programa al apretar la barra espaciadora
  if (keyCode === 32) {
    loops = !loops;
  }

  if (!loops) {
    noLoop();
  } else {
    loop();
  }
}

function drawWords(x) {
  fill(0);
  text("clickeá para empezar", x, height / 2 - fontSize * 2);
  text("apretá espacio para pausar", x, height / 2);
  text("mové el cursor para construir la grilla", x, height / 2 + fontSize);
  text(
    "actualizá la página para reiniciar (ctrl+R) ",
    x,
    height / 2 + fontSize * 2
  );
}
