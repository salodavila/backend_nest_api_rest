import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../../roles/entities/role.entity";

@Entity()
export class Permission {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    action: string; //'create', 'read', 'update', 'delete'

    @Column()
    subject: string; //'user', 'producto', 'role', 'permission'

    @Column({default: true})
    visibleInMenu: boolean; //Se puede mostrar en el menú (sidebar)

    @Column({nullable: true})
    label: string;

    @Column({nullable: true})
    route: string;

    @ManyToMany(() => Role, (role) => role.permission)
    roles: Role[]
}
