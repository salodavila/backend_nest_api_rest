import { Inject, OnApplicationBootstrap } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from 'bcrypt';
import { Repository } from "typeorm";
import { User } from "../../modules/admin/users/entities/user.entity";
import { Role } from "../../modules/admin/roles/entities/role.entity";
import { Permission } from "../../modules/admin/permissions/entities/permission.entity";

export class SeedService implements OnApplicationBootstrap{
    constructor(
        @InjectRepository(User) private readonly userRepo:Repository<User>,
        @InjectRepository(Role) private readonly roleRepo:Repository<Role>,
        @InjectRepository(Permission) private readonly permRepo:Repository<Permission>
    ){}
    
    async onApplicationBootstrap() {
        await this.run();
    }

    async run(){
        //1.Crear permisos básicos
        const countPerms = await this.permRepo.count();

        if(countPerms > 0) return; //Si existen datos, no ejecutar

        const pReadUsers = this.permRepo.create({
            action: 'read', 
            subject: 'users', 
            label: 'Listar Usuarios', 
            visibleInMenu: true, 
            route: "/admin/users"});

        const pWriteUsers = this.permRepo.create({
            action: 'create', 
            subject: 'users', 
            label: 'Crear Usuarios'
        });

        await this.permRepo.save([pReadUsers, pWriteUsers]);

        //2. Crear roles
        const adminRole = this.roleRepo.create({
            name: 'Admin', 
            descripcion: 'Administrador', 
            permission:[pReadUsers,pWriteUsers]
        });

        await this.roleRepo.save([adminRole]);

        //3. Crear usuario Admin
        const adminUser = this.userRepo.create({
            username:'Admin', 
            email:'admin@mail.com', 
            password: await bcrypt.hash('admin54321',12), 
            isActive: true, 
            roles: [adminRole]
        })

        await this.userRepo.save(adminUser);

        console.log('Ejecutó Seeders con éxito.');
    };
}