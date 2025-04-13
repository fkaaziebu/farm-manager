erDiagram
    Farm ||--o{ Livestock : manages
    Farm ||--o{ PoultryBatch : manages
    Farm ||--o{ AquacultureBatch : manages
    Farm ||--o{ CropBatch : manages
    Farm ||--o{ Hive : manages
    Farm ||--o{ HousingUnit : contains
    Farm }o--|| Admin : managed_by
    Farm }o--o{ Worker : employs

    Livestock }o--|| Pen : housed_in
    Livestock ||--o{ Livestock : parents
    Livestock ||--o{ ExpenseRecord : has
    Livestock ||--o{ HealthRecord : has
    Livestock ||--o{ GrowthRecord : has
    Livestock }o--o{ BreedingRecord : participates_in
    Livestock }o--o{ SalesRecord : sold_in

    PoultryBatch }o--|| Coop : housed_in
    PoultryBatch ||--o{ ExpenseRecord : has
    PoultryBatch ||--o{ HealthRecord : has
    PoultryBatch ||--o{ GrowthRecord : has
    PoultryBatch ||--o{ SalesRecord : sold_in

    AquacultureBatch }o--|| Pond : housed_in
    AquacultureBatch ||--o{ ExpenseRecord : has
    AquacultureBatch ||--o{ HealthRecord : has
    AquacultureBatch ||--o{ GrowthRecord : has
    AquacultureBatch ||--o{ SalesRecord : sold_in

    CropBatch }o--o| Field : grown_in
    CropBatch }o--o| Greenhouse : grown_in
    CropBatch ||--o{ ExpenseRecord : has
    CropBatch ||--o{ SalesRecord : sold_in

    Hive }o--|| Apiary : located_in
    Hive ||--o{ ExpenseRecord : has
    Hive }o--o{ SalesRecord : sold_in

    HousingUnit ||--o{ ExpenseRecord : has
    HousingUnit ||..|| Barn : is_a
    HousingUnit ||..|| PoultryHouse : is_a
    HousingUnit ||..|| AquacultureSystem : is_a
    HousingUnit ||..|| Field : is_a
    HousingUnit ||..|| Greenhouse : is_a
    HousingUnit ||..|| Apiary : is_a
    HousingUnit ||..|| Pen : is_a
    HousingUnit ||..|| Coop : is_a
    HousingUnit ||..|| Pond : is_a

    Barn ||--o{ Pen : contains
    PoultryHouse ||--o{ Coop : contains
    AquacultureSystem ||--o{ Pond : contains

    Worker }o--|| Admin : supervised_by
