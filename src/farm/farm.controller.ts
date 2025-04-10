import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { FarmService } from "./farm.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { Roles } from "./guards/roles.decorator";

// Dto's

import { RolesGuard } from "./guards/roles.guard";
import {
  AddAnimalBreedingRecordBodyDto,
  AddAnimalExpenseRecordBodyDto,
  AddAnimalExpenseRecordParamsDto,
  AddAnimalGrowthRecordBodyDto,
  AddAnimalHealthRecordBodyDto,
  AddAnimalSalesRecordBodyDto,
  AddAnimalsToRoomBodyDto,
  AddAnimalsToRoomParamsDto,
  AddFarmWorkersBodyDto,
  AddFarmWorkersParamsDto,
  AddHousesToFarmBodyDto,
  AddRoomsToHouseBodyDto,
  AddRoomsToHouseParamsDto,
  CreateFarmBodyDto,
} from "./dto";

@Controller("v1")
export class FarmController {
  constructor(private readonly farmService: FarmService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Post("/farm:add")
  async createFarm(@Req() req, @Body() createFarmBodyDto: CreateFarmBodyDto) {
    const { email } = req.user;
    return this.farmService.createFarm({ ...createFarmBodyDto, email });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Post("/farms/:farmId/workers:add")
  async addFarmWorkers(
    @Req() req,
    @Param() addFarmWorkersParamsDto: AddFarmWorkersParamsDto,
    @Body() addFarmWorkersBodyDto: AddFarmWorkersBodyDto,
  ) {
    const { email } = req.user;

    return this.farmService.addFarmWorkers({
      email,
      ...addFarmWorkersParamsDto,
      ...addFarmWorkersBodyDto,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Post("/farm/:farmId/houses:add")
  async addHousesToFarm(
    @Req() req,
    @Param() addHousesToFarmParamsDto: AddFarmWorkersParamsDto,
    @Body() addHousesToFarmBodyDto: AddHousesToFarmBodyDto,
  ) {
    const { email } = req.user;

    return this.farmService.addHousesToFarm({
      email,
      ...addHousesToFarmParamsDto,
      ...addHousesToFarmBodyDto,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Post("/farm/:farmId/houses/:houseNumber/rooms:add")
  async addRoomsToHouse(
    @Req() req,
    @Param() addRoomsToHouseParamsDto: AddRoomsToHouseParamsDto,
    @Body() addRoomsToHouseBodyDto: AddRoomsToHouseBodyDto,
  ) {
    const { email } = req.user;

    return this.farmService.addRoomsToHouse({
      email,
      ...addRoomsToHouseParamsDto,
      ...addRoomsToHouseBodyDto,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Post("/farm/:farmId/houses/:houseNumber/rooms/:roomNumber/animals:add")
  async addAnimalsToRoom(
    @Req() req,
    @Param() addAnimalsToRoomParamsDto: AddAnimalsToRoomParamsDto,
    @Body() addAnimalsToRoomBodyDto: AddAnimalsToRoomBodyDto,
  ) {
    const { email } = req.user;

    return this.farmService.addAnimalsToRoom({
      email,
      ...addAnimalsToRoomParamsDto,
      ...addAnimalsToRoomBodyDto,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @Post("/breeding-record:add")
  async addAnimalBreedingRecord(
    @Req() req,
    @Body() addAnimalBreedingRecordBodyDto: AddAnimalBreedingRecordBodyDto,
  ) {
    const { email, role } = req.user;

    return this.farmService.addAnimalBreedingRecord({
      email,
      role,
      ...addAnimalBreedingRecordBodyDto,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @Post("/animals/:tagNumber/expense-record:add")
  async addAnimalExpenseRecord(
    @Req() req,
    @Param() addAnimalExpenseRecordParamsDto: AddAnimalExpenseRecordParamsDto,
    @Body() addAnimalExpenseRecordBodyDto: AddAnimalExpenseRecordBodyDto,
  ) {
    const { email, role } = req.user;

    return this.farmService.addAnimalExpenseRecord({
      email,
      role,
      ...addAnimalExpenseRecordParamsDto,
      ...addAnimalExpenseRecordBodyDto,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @Post("/animals/:tagNumber/growth-record:add")
  async addAnimalGrowthRecord(
    @Req() req,
    @Param() addAnimalGrowthRecordParamsDto: AddAnimalExpenseRecordParamsDto,
    @Body() addAnimalGrowthRecordBodyDto: AddAnimalGrowthRecordBodyDto,
  ) {
    const { email, role } = req.user;
    return this.farmService.addAnimalGrowthRecord({
      email,
      role,
      ...addAnimalGrowthRecordParamsDto,
      ...addAnimalGrowthRecordBodyDto,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @Post("/animals/:tagNumber/health-record:add")
  async addAnimalHealthRecord(
    @Req() req,
    @Param() addAnimalHealthRecordParamsDto: AddAnimalExpenseRecordParamsDto,
    @Body() addAnimalHealthRecordBodyDto: AddAnimalHealthRecordBodyDto,
  ) {
    const { email, role } = req.user;

    return this.farmService.addAnimalHealthRecord({
      email,
      role,
      ...addAnimalHealthRecordParamsDto,
      ...addAnimalHealthRecordBodyDto,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @Post("/animals/:tagNumber/sales-record:add")
  async addAnimalSalesRecord(
    @Req() req,
    @Param() addAnimalSalesRecordParamsDto: AddAnimalExpenseRecordParamsDto,
    @Body() addAnimalSalesRecordBodyDto: AddAnimalSalesRecordBodyDto,
  ) {
    const { email, role } = req.user;

    return this.farmService.addAnimalSalesRecord({
      email,
      role,
      ...addAnimalSalesRecordParamsDto,
      ...addAnimalSalesRecordBodyDto,
    });
  }
}
