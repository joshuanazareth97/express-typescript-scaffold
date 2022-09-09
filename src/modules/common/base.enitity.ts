import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";

export class Base {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  createdOn: Date;

  @UpdateDateColumn()
  updatedOn: Date;

  @DeleteDateColumn()
  deletedOn: Date;

  @CreateDateColumn()
  createdBy: string;

  @UpdateDateColumn()
  updatedBy?: string;

  @DeleteDateColumn()
  deletedBy?: string;
}
