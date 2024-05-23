import { Component, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource as MatTableDataSource } from '@angular/material/table';
import { MatPaginator as MatPaginator, PageEvent as PageEvent } from '@angular/material/paginator';

// Animations
import Swal from "sweetalert2";

// Services
import { RewardsService } from 'src/app/auth/pages/account/services/rewards.service';
import { DataRewards, ResetReward, Rewards, UpdateReward } from 'src/app/auth/pages/account/interfaces/rewards.interface';

// Change location app
import localeESMX from "@angular/common/locales/es-MX";
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeESMX);

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.component.html',
  providers: [
    { provide: LOCALE_ID, useValue: 'es-MX' }
  ]
})

export class RewardsComponent implements OnInit {

  // Refereces
  public displayedColumns: string[] = ['id', 'name', 'surname', 'email', 'status', 'points', 'updated_at', 'actions'];
  public dataSource!: MatTableDataSource<DataRewards>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;  

  // MatPaginator 
  public length: number = 0;
  public pageIndex: number = 1;

  constructor(private _rewardService: RewardsService) {
    // Get rewards
    this.getRewards();
  }

  ngOnInit(): void {
    this.scrollTop();
  }

  scrollTop() {
    var scrollElem = document.querySelector('#moveTop');
    scrollElem!.scrollIntoView();
  }

  /**
   * Get all rewards
   */
  public getRewards(page?: number) {
    this._rewardService.getRewards(page)
    .subscribe({
      next: ({ code, status, reward }: Rewards) => {
        if (code === 200 && status === 'success') {
          // Set Requets
          this.dataSource = new MatTableDataSource(reward.data);
          // Assign the length data
          this.paginator.length = reward.total;
        }
      }
    });
  }

  /**
   * Reset Reward
   * @param client_id
   */
  public resetReward(client_id: number): void {
    this._rewardService.resetReward(client_id)
    .subscribe({
      next: ({ code, status, message }: ResetReward) => {
        if (code === 200 && status === 'success') {
          this.launchAlert(message, 'success');
        } else {
          this.launchAlert(message, 'error');
        }
      }
    });
  }

  /**
   * Update Reward
   * @param reward_id Number
   */
  public updateReward(reward_id: number, status_reward: string) {
    this._rewardService.updateReward(reward_id, status_reward)
    .subscribe({
      next: ({ code, status, message }: UpdateReward) => {
        if (code === 200 && status === 'success') {
          // Reaload points rewards
          if (status_reward === 'transferred') {
            this.resetReward(reward_id);
          } else {
            this.launchAlert(message, 'success');
          }
        } else {
          this.launchAlert(message, 'error');
        }
      }
    });
  }

  /**
   * Function Show Alert
   * @param message String
   * @param type String
   */
  public launchAlert(message: string, type: any) {
    Swal.fire({
      icon: type,
      text: message,
      showConfirmButton: true,
      confirmButtonColor: '#EEB838',
      timer: 3500
    }).then(() => {
      this.getRewards();
      this.scrollTop();
    });
  }

  /**
   * Search in datatable
   * @param event Event
   */
  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Pagination Change
   * @param event PageEvent
   */
  public paginationChange(event: PageEvent) {
    this.getRewards(event.pageIndex + 1);
    this.scrollTop();
  }

}
