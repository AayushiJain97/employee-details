import { Component, OnInit,ViewChild,Inject } from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface UserData {
  id:number;
  name: string;
  email: string;
  doj: string;
  address:string;
  role:string;
}

export interface DialogData {
  name: string;
  email: string;
  doj:string;
  address:string;
  role:string;
}

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  email: string;
  name: string;
  doj:string;
  address:string;
  role:string;
  id:number;
  users:UserData[]=[];
  displayedColumns: string[] = ['name', 'email', 'doj','address','role','action'];
  dataSource: MatTableDataSource<UserData>;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(public dialog: MatDialog, private http: HttpClient,) {
      this.http.get("http://localhost:3000/getDetails").subscribe(data=>{
        var length = Object.keys(data).length;
        const users = Array.from({length: length}, (_, k) => createNewUser(data[k]));
       this.dataSource = new MatTableDataSource(users);
       this.dataSource.sort = this.sort;
      })
   }

  ngOnInit() {
    //this.dataSource.sort = this.sort;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  openDialog(str:string): void {
    const dialogRef = this.dialog.open(PopUpComponent, {
      width: '350px',
      data: {name: this.name,email: this.email,doj:this.doj,address:this.address,role:this.role}
    });

    dialogRef.afterClosed().subscribe(result => {
       if(str==='add'){
         this.http.post("http://localhost:3000/add/",result).subscribe(data=>{
           console.log("success");
           this.getUserData();
         });
       } else if(str==='update'){
        this.http.post("http://localhost:3000/update?id="+this.id,result).subscribe(data=>{
          console.log("success");
          this.getUserData();
        });
        this.name='';
        this.email='';
        this.doj='';
        this.address='';
        this.role='';
       }
    });
  }
  deleteEmployee(id:number){
    this.http.get("http://localhost:3000/delete?id="+id).subscribe(data=>{
      console.log(data);
      this.getUserData();
    });
  }
  updateEmployee(i:number,id:number){
    var len=this.dataSource.data.length;
    for(let i=0;i<len;i++){
      if(this.dataSource.data[i].id==id){
        this.name=this.dataSource.data[i].name;
        this.email=this.dataSource.data[i].email;
        this.doj=this.dataSource.data[i].doj;
        this.address=this.dataSource.data[i].address;
        this.role=this.dataSource.data[i].role;
        this.id=id;
        this.openDialog('update');
      }
    }
  }
  getUserData(){
    this.http.get("http://localhost:3000/getDetails").subscribe(data=>{
        var length = Object.keys(data).length;
        const users = Array.from({length: length}, (_, k) => createNewUser(data[k]));
       this.dataSource = new MatTableDataSource(users);
       this.dataSource.sort = this.sort;
      });
  }
}

/** Builds and returns a new User. */
function createNewUser(data: any): UserData {
  return {
    id:data.id,
    name: data.name,
    email: data.email,
    doj:data.doj,
    address: data.address,
    role:data.role
  };
}

@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
})
export class PopUpComponent {

  constructor(
    public dialogRef: MatDialogRef<PopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}