import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from './user.interface';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async registerUser(email: string, password: string): Promise<any> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ email, password: hashedPassword });
    return newUser.save();
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email });
  }

  async getUserById(userId: string): Promise<User> {
    try {
      const user = await this.userModel.findById(userId);
      return user;
    } catch (error) {
      throw new Error('Error retrieving user');
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email }).select('password');
    if (user && (await bcrypt.compare(password, user.password))) {
      return this.generateToken(user);
    }
    return null;
  }

  async updateUser(userId: string, updateData: Partial<User>): Promise<User> {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        updateData,
        { new: true },
      );
      return updatedUser;
    } catch (error) {
      console.log(error);
      throw new Error('Error updating user');
    }
  } 

  private generateToken(user: User): string {
    const payload = { email: user.email, sub: user.id };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  }
}
