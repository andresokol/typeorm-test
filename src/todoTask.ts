import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn} from "typeorm";

@Entity()
export class TodoTask {
    @PrimaryGeneratedColumn("rowid")
    id: string;

    @Column()
    name: string;

    @Column({default: false})
    isCompleted: boolean;

    @Column({unique: true})
    idempotencyKey: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    modifiedAt: Date;
}
