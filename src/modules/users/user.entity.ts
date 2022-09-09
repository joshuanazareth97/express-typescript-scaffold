import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { transformPassword } from "../authentication";
import { Base } from "../common/base.enitity";

@Entity("users")
export class User extends Base {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar" })
  firstName: string;

  @Column({ type: "varchar" })
  lastName: string;

  @Column({ type: "varchar" })
  email: string;

  @Column({ type: "varchar" })
  password: string;

  @Column({ type: "varchar", nullable: true })
  organization?: string;

  @Column({ default: false, type: "boolean" })
  isVerified: boolean;

  @Column({ default: true, type: "boolean" })
  isActive: boolean;

  constructor(user: User) {
    super();
    if (user) {
      this.email = (user.email || "").toLowerCase();
      this.password = transformPassword(user.password);
      this.firstName = user.firstName;
      this.lastName = user.lastName;
    }
  }
}
