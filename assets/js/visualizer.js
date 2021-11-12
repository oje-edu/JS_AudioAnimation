function main() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  class Bar {
    constructor(x, y, width, height, color, index) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.color = color;
      this.index = index;
    }
    update(micInput) {
      const sound = micInput * 1000;
      if (sound > this.height) {
        this.height = sound;
      } else {
        this.height -= this.height * 0.01;
      }
    }

    draw(context) {
      // context.fillStyle = this.color;
      context.strokeStyle = this.color;
      // context.fillRect(this.x, this.y, this.width, this.height);
      context.save();

      context.translate(canvas.width / 2, canvas.height / 2);
      // context.rotate((this.index * Math.PI * 2) / 100);
      context.rotate(this.index * 0.5);
      context.beginPath();
      // context.moveTo(this.x, this.y);
      context.moveTo(this.x / 12, this.y * 0.75);
      context.lineTo(Math.sin(this.y), Math.cos(this.height) * this.x);
      context.stroke();

      context.restore();
    }
  }

  const microphone = new Microphone();

  let bars = [];
  let barWidth = canvas.width / 1024;
  function createBars() {
    for (let i = 0; i < 1024; i++) {
      let color = `hsl(${Math.random() + 2 * i}, 100%, 50%)`;
      bars.push(new Bar(i * barWidth, canvas.height / 2, 1, 20, color, i));
    }
  }

  createBars();

  function animate() {
    if (microphone.initialized) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const samples = microphone.getSamples();
      bars.forEach(function (bar, i) {
        bar.update(samples[i]);
        bar.draw(ctx);
      });
    }

    requestAnimationFrame(animate);
  }

  animate();
}
