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

    draw(context, volume) {
      // context.fillStyle = this.color;
      context.strokeStyle = this.color;
      // context.fillRect(this.x, this.y, this.width, this.height);
      context.save();

      // context.translate(canvas.width / 2, canvas.height / 2);
      context.translate(0, 0);
      // context.rotate((this.index * Math.PI * 2) / 100);
      context.rotate(this.index * 0.05);
      context.scale(1 + volume * 0.2, 1 + volume * 0.2);

      context.beginPath();
      // context.moveTo(this.x, this.y);
      context.moveTo(this.x / 12, this.y * 0.75);
      context.lineTo(Math.sin(this.y), Math.cos(this.height) * this.x);
      //context.bezierCurveTo(100, 100, this.height, this.height, this.x, this.y);
      context.stroke();

      context.rotate(this.index * 0.75);
      // context.strokeRect(
      //   Math.cos((this.x / 2) * (this.x / 2)),
      //   this.index * 1.5,
      //   // this.y,
      //   // this.width,
      //   this.height / 0.02,
      //   this.height
      // );
      context.beginPath();
      context.arc(
        this.x + this.index * 3,
        this.y,
        this.height * 0.2,
        0,
        Math.PI * 2
      );
      context.stroke();

      context.restore();
    }
  }

  const fftSize = 2048;
  const microphone = new Microphone(fftSize);

  let bars = [];
  let barWidth = canvas.width / (fftSize / 2);
  function createBars() {
    for (let i = 0; i < fftSize / 2; i++) {
      let color = `hsl(${Math.random() + 2 * i}, 100%, 50%)`;
      bars.push(new Bar(i * barWidth, canvas.height / 2, 1, 20, color, i));
    }
  }

  createBars();

  let angle = 0;

  function animate() {
    if (microphone.initialized) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const samples = microphone.getSamples();
      const volume = microphone.getVolume();
      angle -= 0.0001 + volume * 0.02;
      ctx.save();

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(angle);
      bars.forEach(function (bar, i) {
        bar.update(samples[i]);
        bar.draw(ctx, volume);
      });

      ctx.restore();
    }

    requestAnimationFrame(animate);
  }

  animate();
}
