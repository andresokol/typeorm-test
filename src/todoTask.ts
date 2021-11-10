import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class TodoTask {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({default: false})
    isCompleted: boolean;
}