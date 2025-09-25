import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

import { ns } from '../../common/constants';

export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

@Entity({ schema: ns, name: 'user' })
export class UserEntity extends BaseEntity implements IUser {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({ type: 'varchar' })
    public firstName: string;

    @Column({ type: 'varchar' })
    public lastName: string;

    @Column({ type: 'varchar' })
    public email: string;

    @Exclude()
    @Column({ type: 'varchar' })
    public password: string;
}
