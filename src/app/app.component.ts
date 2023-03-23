import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

interface vector
{
  x : number,
  y : number
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements AfterViewInit 
{

  @ViewChild('canvas', { static: false, read: ElementRef}) canvas: ElementRef = {} as ElementRef;
  public ctx!: CanvasRenderingContext2D;

  points : vector[] = 
  [
    {x: 50, y: 20},
    {x: 230, y: 30},
    {x: 150, y: 80},
    {x: 250, y: 100}
  ]

  move : boolean = false;
  mousePos : vector = {x : 0, y : 0}
  controlPointRadius : number = 10;
  currentControlPointIndex : number = -1;
  distanceBetweenControlNControlpointX = 0;
  distanceBetweenControlNControlpointY = 0;
  canChangeDistanceBetweenControlNControlpoint = true;

  ngAfterViewInit(): void
  {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.animationLoop();
  }

  animationLoop()
  {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.drawControlpointsLinks();
    this.drawBezierCurve(this.points[0], this.points[1], this.points[2], this.points[3], 'black');
    this.drawControlPoint(this.points[0], this.controlPointRadius, 'green');
    this.drawControlPoint(this.points[3], this.controlPointRadius, 'green');
    this.drawControlPoint(this.points[1], this.controlPointRadius, 'red');
    this.drawControlPoint(this.points[2], this.controlPointRadius, 'red');
    this.moveControlpoint();
    requestAnimationFrame(() => this.animationLoop());
  }

  mousePosition(evt : any)
  {
    var rect = this.ctx.canvas.getBoundingClientRect();
    this.mousePos.x = evt.clientX - rect.left;
    this.mousePos.y = evt.clientY - rect.top;
  }

  drawBezierCurve(startPosition : vector, firstControlPoint : vector, secondControlPoint : vector, endPosition : vector, color : string = 'red')
  {
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.moveTo(startPosition.x, startPosition.y);
    this.ctx.bezierCurveTo(firstControlPoint.x, firstControlPoint.y, secondControlPoint.x, secondControlPoint.y, endPosition.x, endPosition.y);
    this.ctx.stroke();
  }

  drawControlPoint(controlPosition : vector, radius : number = 5, color : string = 'blue')
  {
    this.ctx.beginPath();
    this.ctx.fillStyle = color;
    this.ctx.arc(controlPosition.x,controlPosition.y, radius, 0, 2 * Math.PI);
    this.ctx.fill(); 
  }

  verifyMouseOverControlpoint() : number
  {
    for(let i = 0; i < this.points.length; i++)
    {
      if (this.mousePos.x > this.points[i].x - this.controlPointRadius &&
          this.mousePos.x < this.points[i].x + this.controlPointRadius &&
          this.mousePos.y > this.points[i].y - this.controlPointRadius &&
          this.mousePos.y < this.points[i].y + this.controlPointRadius)
        {
          return i;
        }
    }
    return -1;
  }

  moveControlpoint()
  {
    if(this.move && this.currentControlPointIndex == -1)
    {
      this.currentControlPointIndex = this.verifyMouseOverControlpoint();
    }
    else if(this.move)
    {
      this.points[this.currentControlPointIndex].x = this.mousePos.x;
      this.points[this.currentControlPointIndex].y = this.mousePos.y;
      this.moveControlpointWhenMovingPoint();
    }
    else if(!this.move)
    {
      this.canChangeDistanceBetweenControlNControlpoint = true;
      this.currentControlPointIndex = -1;
    }
  }

  drawLinkBetweenPointNControlpoint(point : vector, controlPoint : vector, color : string = 'orange')
  {
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.moveTo(point.x, point.y);
    this.ctx.lineTo(controlPoint.x, controlPoint.y);
    this.ctx.stroke();
  }

  drawControlpointsLinks()
  {
    for(let i = 0; i < this.points.length; i++)
    {
      if(i < this.points.length-1)
        this.drawLinkBetweenPointNControlpoint(this.points[i], this.points[i+1]);
    }
  }
  
  moveControlpointWhenMovingPoint()
  {
    if(this.canChangeDistanceBetweenControlNControlpoint)
    {
       this.distanceBetweenControlNControlpointX = this.points[this.currentControlPointIndex+1].x - this.mousePos.x;
       this.distanceBetweenControlNControlpointY = this.points[this.currentControlPointIndex+1].y - this.mousePos.y;
       this.canChangeDistanceBetweenControlNControlpoint = false;
    }
    this.points[this.currentControlPointIndex+1].x = this.mousePos.x + this.distanceBetweenControlNControlpointX;
      
    this.points[this.currentControlPointIndex+1].y = this.mousePos.y + this.distanceBetweenControlNControlpointY;
  }

  mouseUp()
  {
    this.move = false;
  }

  mouseDown()
  {
    this.move = true;
  }
}
