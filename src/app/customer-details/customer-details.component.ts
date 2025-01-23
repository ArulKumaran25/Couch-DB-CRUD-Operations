import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CouchdbService } from '../couchdb.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent {

  customerId: string = '';
  customerName: string = '';
  email: string = '';
  phoneNumber: string = '';
  customers: any[] = [];
  customerEdit: any = null;

  constructor(private couch: CouchdbService) {}

  ngOnInit(): void {
    this.getAllCustomers();
  }

  create() {
    const data: any = {
      _id: `customer_${this.customerId}`,
      data: {
        customerId: this.customerId,
        customerName: this.customerName,
        email: this.email,
        phoneNumber: this.phoneNumber
      }
    };
    if (this.customerEdit) {
      this.update();
    } else {
      this.couch.addCustomer(data).subscribe({
        next: (response) => {
          alert('Customer Added');
          this.customers.push(data.data);
          this.resetForm();
        },
        error: (error) => {
          alert('Error adding customer');
        }
      });
    }
  }
  getAllCustomers() {
    this.couch.getCustomers().subscribe({
      next: (response) => {
        this.customers = response.rows.map((row: any) => ({
          ...row.doc.data,
          _rev:row.doc._rev,
          _id:row.doc._id
        }));
      },
      error:(error) => {
        alert('Error occurs on fetching the customer details');
      }
    });
  }
  updateCustomer(customer: any) {
    this.customerId = customer.customerId;
    this.customerName = customer.customerName;
    this.email = customer.email;
    this.phoneNumber = customer.phoneNumber;
    this.customerEdit = customer;
  }

  update() {
    if (this.customerEdit) {
      const updatedData = {
        customerId: this.customerId,
        customerName: this.customerName,
        email: this.email,
        phoneNumber: this.phoneNumber
      };

      const dataToUpdate = {
        _id: this.customerEdit._id,
        _rev: this.customerEdit._rev,
        data: updatedData
      };

      this.couch.updateCustomer(this.customerEdit._id, this.customerEdit._rev, dataToUpdate).subscribe({
        next: (response) => {
          alert('Customer Updated');
          const index = this.customers.findIndex(customer => customer._id === this.customerEdit._id);
          if (index !== -1) {
            this.customers[index] = { ...updatedData, _id: this.customerEdit._id, _rev: response.rev };
          }
          this.resetForm();
          this.customerEdit = null;
        },
        error: (error) => {
          alert('Error updating customer');
        }
      });
    }
  }

  deleteCustomerById(_id: string, _rev: string) {
    this.couch.deleteCustomer(_id, _rev).subscribe({
      next: (response) => {
        alert('Customer Deleted');
        this.customers = this.customers.filter(customer => customer._id !== _id);
      },
      error: (error) => {
        alert('Error deleting customer');
      }
    });
  }

  resetForm() {
    this.customerId = '';
    this.customerName = '';
    this.email = '';
    this.phoneNumber = '';
  }
}
