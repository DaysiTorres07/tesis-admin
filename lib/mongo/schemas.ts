import mongoose, { mongo, Schema } from "mongoose";
import {
  Advance,
  Auditory,
  Backup,
  CloudImage,
  FactureInmogestion,
  Comment,
  Client,
  Facture,
  FactureAdvance,
  FactureCenter,
  FactureProject,
  FactureProvider,
  Solicitude,
  User,
  UserDeparment,
  FactureCalderon,
  FactureAdvanceInmogestion,
  FactureAdvanceCalderon,
  FactureAdvanceBalcon,
  SolicitudeInmogestion,
  SolicitudeCalderon,
  AdvanceInmogestion,
  AdvanceCalderon,
  AdvanceBalcon,
  AdvanceRecaudaciones,
  FactureAdvanceRecaudaciones,
  FactureBalcon,
  FactureRecaudaciones,
  SolicitudeBalcon,
  SolicitudeRecaudaciones,
  FactureCenterIg,
  FactureCenterCalderon,
  FactureCenterBalcon,
  FactureProviderIg,
  FactureProviderCalderon,
  FactureProviderBalcon,
  FactureProviderRecaudaciones,
  Employees,
  FactureEmployees,
  Nomina,
  Bank,
  Holidays,
  Permission,
  Loan,
} from "../types";

const CloudImageSchema = new mongoose.Schema<CloudImage>(
  {
    // public_id: { type: String, },
    secure_url: { type: String },
  },
  { timestamps: true }
);

const ProjectSchema = new mongoose.Schema<FactureProject>(
  {
    name: { type: String },
  },
  { timestamps: true }
);

// Duplicate the ID field.
ProjectSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
ProjectSchema.set("toJSON", {
  virtuals: true,
});

export const ProjectModel =
  mongoose.models.Projects || mongoose.model("Projects", ProjectSchema);

const CenterSchema = new mongoose.Schema<FactureCenter>(
  {
    name: { type: String },
    projectId: { type: String },
  },
  { timestamps: true }
);

CenterSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

CenterSchema.set("toJSON", {
  virtuals: true,
});

export const CenterModel =
  mongoose.models.Centers || mongoose.model("Centers", CenterSchema);

const CenterIgSchema = new mongoose.Schema<FactureCenterIg>(
  {
    name: { type: String },
  },
  { timestamps: true }
);

CenterIgSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

CenterIgSchema.set("toJSON", {
  virtuals: true,
});

export const CenterIgModel =
  mongoose.models.CentersIg || mongoose.model("CentersIg", CenterIgSchema);

const CenterCalderonSchema = new mongoose.Schema<FactureCenterCalderon>(
  {
    name: { type: String },
  },
  { timestamps: true }
);

CenterCalderonSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

CenterCalderonSchema.set("toJSON", {
  virtuals: true,
});

export const CenterCalderonModel =
  mongoose.models.CentersCalderon ||
  mongoose.model("CentersCalderon", CenterCalderonSchema);

const CenterBalconSchema = new mongoose.Schema<FactureCenterBalcon>(
  {
    name: { type: String },
  },
  { timestamps: true }
);

CenterBalconSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

CenterBalconSchema.set("toJSON", {
  virtuals: true,
});

export const CenterBalconModel =
  mongoose.models.CentersBalcon ||
  mongoose.model("CentersBalcon", CenterBalconSchema);

const ProviderSchema = new mongoose.Schema<FactureProvider>(
  {
    name: { type: String },
    email: { type: String },
  },
  { timestamps: true }
);

ProviderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

ProviderSchema.set("toJSON", {
  virtuals: true,
});

export const ProviderModel =
  mongoose.models.Providers || mongoose.model("Providers", ProviderSchema);

const ProviderIgSchema = new mongoose.Schema<FactureProviderIg>(
  {
    name: { type: String },
    emailIg: { type: String },
  },
  { timestamps: true }
);

ProviderIgSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

ProviderIgSchema.set("toJSON", {
  virtuals: true,
});

export const ProviderIgModel =
  mongoose.models.ProvidersIg ||
  mongoose.model("ProvidersIg", ProviderIgSchema);

const ProviderCalderonSchema = new mongoose.Schema<FactureProviderCalderon>(
  {
    name: { type: String },
    emailCalderon: { type: String },
  },
  { timestamps: true }
);

ProviderCalderonSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

ProviderCalderonSchema.set("toJSON", {
  virtuals: true,
});

export const ProviderCalderonModel =
  mongoose.models.ProvidersCalderon ||
  mongoose.model("ProvidersCalderon", ProviderCalderonSchema);

const ProviderBalconSchema = new mongoose.Schema<FactureProviderBalcon>(
  {
    name: { type: String },
    emailBalcon: { type: String },
  },
  { timestamps: true }
);

ProviderBalconSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

ProviderBalconSchema.set("toJSON", {
  virtuals: true,
});

export const ProviderBalconModel =
  mongoose.models.ProvidersBalcon ||
  mongoose.model("ProvidersBalcon", ProviderBalconSchema);

const ProviderRecaudacionesSchema =
  new mongoose.Schema<FactureProviderRecaudaciones>(
    {
      name: { type: String },
      emailRecaudaciones: { type: String },
    },
    { timestamps: true }
  );

ProviderRecaudacionesSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

ProviderRecaudacionesSchema.set("toJSON", {
  virtuals: true,
});

export const ProviderRecaudacionesModel =
  mongoose.models.ProvidersRecaudaciones ||
  mongoose.model("ProvidersRecaudaciones", ProviderRecaudacionesSchema);

const BanksSchema = new mongoose.Schema<Bank>(
  {
    bank: { type: String },
    codBank: { type: String },
  },
  { timestamps: true }
);

BanksSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
BanksSchema.set("toJSON", {
  virtuals: true,
});

export const BanksModel =
  mongoose.models.Banks || mongoose.model("Banks", BanksSchema);

const ClientSchema = new mongoose.Schema<Client>(
  {
    beneficiary: { type: String },
    identificationCard: {
      type: String,
      // minlength: [10, 'min length of dni'],
      // maxlength: [13, 'max length of ruc'],
    },
    bank: { type: String },
    accountBank: { type: String },
    accountType: { type: String },
    accountTypeB: { type: String },
    codBank: { type: String },
    typeCard: { type: String },
  },
  { timestamps: true }
);

ClientSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
ClientSchema.set("toJSON", {
  virtuals: true,
});

export const ClientModel =
  mongoose.models.Clients || mongoose.model("Clients", ClientSchema);

const FactureSchema = new mongoose.Schema<Facture>(
  {
    //Solicitante
    project: { type: ProjectSchema },
    centerCost: { type: CenterSchema },
    centerCostIg: { type: CenterIgSchema },
    centerCostCalderon: { type: CenterCalderonSchema },
    centerCostBalcon: { type: CenterBalconSchema },
    provider: { type: ProviderSchema },
    email: { type: ProviderSchema },
    providerIg: { type: ProviderIgSchema },
    providerCalderon: { type: ProviderCalderonSchema },
    providerBalcon: { type: ProviderBalconSchema },
    providerRecaudaciones: { type: ProviderRecaudacionesSchema },
    factureDate: { type: String },
    factureNumber: { type: Number },
    details: { type: String },
    value: { type: Number },
    file: { type: CloudImageSchema },
    observation: { type: String },
    typeCard: { type: String },
    codBank: { type: String },
    typeProv: { type: String },
    //contabilidad
    numberRetention: { type: Number },
    valueRetention: { type: Number },
    closingSeat: { type: String },
    valueNet: { type: Number },
    documentDelivered: { type: String },
    observationConta: { type: String },
    //tesoreria
    beneficiary: { type: String },
    identificationCard: {
      type: String,
      // minlength: [10, 'min length of dni'],
      // maxlength: [13, 'max length of ruc'],
    },
    bank: { type: String },
    accountBank: { type: String },
    accountType: { type: String },
    accountTypeB: { type: String },
    numberCheck: { type: String },
    bankCheck: { type: String },
    discount: { type: Number },
    increase: { type: Number },
    observationTreasury: { type: String },
    //Financiero
    payments: { type: String },
    typePayments: { type: String },
    //tesoreria 2
    accreditedPayment: { type: Number },
    difference: { type: Number },
    treasuryFile: { type: CloudImageSchema },
    debitNote: { type: String },
  },
  { timestamps: true }
);

// Duplicate the ID field.
FactureSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
FactureSchema.set("toJSON", {
  virtuals: true,
});

const FactureInmogestionSchema = new mongoose.Schema<FactureInmogestion>(
  {
    //Solicitante
    project: { type: ProjectSchema },
    centerCost: { type: CenterSchema },
    centerCostIg: { type: CenterIgSchema },
    centerCostCalderon: { type: CenterCalderonSchema },
    centerCostBalcon: { type: CenterBalconSchema },
    provider: { type: ProviderSchema },
    email: { type: ProviderSchema },
    providerIg: { type: ProviderIgSchema },
    providerCalderon: { type: ProviderCalderonSchema },
    providerBalcon: { type: ProviderBalconSchema },
    providerRecaudaciones: { type: ProviderRecaudacionesSchema },
    factureDate: { type: String },
    factureNumber: { type: Number },
    details: { type: String },
    value: { type: Number },
    file: { type: CloudImageSchema },
    observation: { type: String },
    typeCard: { type: String },
    codBank: { type: String },
    typeProv: { type: String },
    //contabilidad
    numberRetention: { type: Number },
    valueRetention: { type: Number },
    valueNet: { type: Number },
    closingSeat: { type: String },
    documentDelivered: { type: String },
    observationConta: { type: String },
    //tesoreria
    beneficiary: { type: String },
    identificationCard: {
      type: String,
      // minlength: [10, 'min length of dni'],
      // maxlength: [13, 'max length of ruc'],
    },
    bank: { type: String },
    accountBank: { type: String },
    accountType: { type: String },
    accountTypeB: { type: String },
    numberCheck: { type: String },
    bankCheck: { type: String },
    discount: { type: Number },
    increase: { type: Number },
    observationTreasury: { type: String },
    //Financiero
    payments: { type: String },
    typePayments: { type: String },
    //tesoreria 2
    accreditedPayment: { type: Number },
    difference: { type: Number },
    treasuryFile: { type: CloudImageSchema },
    debitNote: { type: String },
  },
  { timestamps: true }
);

// Duplicate the ID field.
FactureInmogestionSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
FactureInmogestionSchema.set("toJSON", {
  virtuals: true,
});

const FactureCalderonSchema = new mongoose.Schema<FactureCalderon>(
  {
    //Solicitante
    project: { type: ProjectSchema },
    centerCost: { type: CenterSchema },
    centerCostIg: { type: CenterIgSchema },
    centerCostCalderon: { type: CenterCalderonSchema },
    centerCostBalcon: { type: CenterBalconSchema },
    provider: { type: ProviderSchema },
    providerIg: { type: ProviderIgSchema },
    email: { type: ProviderSchema },
    providerCalderon: { type: ProviderCalderonSchema },
    providerBalcon: { type: ProviderBalconSchema },
    providerRecaudaciones: { type: ProviderRecaudacionesSchema },
    factureDate: { type: String },
    factureNumber: { type: Number },
    details: { type: String },
    value: { type: Number },
    file: { type: CloudImageSchema },
    observation: { type: String },
    typeCard: { type: String },
    codBank: { type: String },
    typeProv: { type: String },
    //contabilidad
    numberRetention: { type: Number },
    valueRetention: { type: Number },
    valueNet: { type: Number },
    documentDelivered: { type: String },
    observationConta: { type: String },
    closingSeat: { type: String },
    //tesoreria
    beneficiary: { type: String },
    identificationCard: {
      type: String,
      // minlength: [10, 'min length of dni'],
      // maxlength: [13, 'max length of ruc'],
    },
    bank: { type: String },
    accountBank: { type: String },
    accountType: { type: String },
    numberCheck: { type: String },
    bankCheck: { type: String },
    accountTypeB: { type: String },
    discount: { type: Number },
    increase: { type: Number },
    observationTreasury: { type: String },
    //Financiero
    payments: { type: String },
    typePayments: { type: String },
    //tesoreria 2
    accreditedPayment: { type: Number },
    difference: { type: Number },
    treasuryFile: { type: CloudImageSchema },
    debitNote: { type: String },
  },
  { timestamps: true }
);

// Duplicate the ID field.
FactureCalderonSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
FactureCalderonSchema.set("toJSON", {
  virtuals: true,
});

const FactureBalconSchema = new mongoose.Schema<FactureBalcon>(
  {
    //Solicitante
    project: { type: ProjectSchema },
    centerCost: { type: CenterSchema },
    centerCostIg: { type: CenterIgSchema },
    centerCostCalderon: { type: CenterCalderonSchema },
    centerCostBalcon: { type: CenterBalconSchema },
    provider: { type: ProviderSchema },
    email: { type: ProviderSchema },
    providerIg: { type: ProviderIgSchema },
    providerCalderon: { type: ProviderCalderonSchema },
    providerBalcon: { type: ProviderBalconSchema },
    providerRecaudaciones: { type: ProviderRecaudacionesSchema },
    factureDate: { type: String },
    factureNumber: { type: Number },
    details: { type: String },
    value: { type: Number },
    file: { type: CloudImageSchema },
    observation: { type: String },
    typeCard: { type: String },
    codBank: { type: String },
    typeProv: { type: String },
    //contabilidad
    numberRetention: { type: Number },
    valueRetention: { type: Number },
    valueNet: { type: Number },
    documentDelivered: { type: String },
    accountTypeB: { type: String },
    observationConta: { type: String },
    closingSeat: { type: String },
    //tesoreria
    beneficiary: { type: String },
    identificationCard: {
      type: String,
      // minlength: [10, 'min length of dni'],
      // maxlength: [13, 'max length of ruc'],
    },
    bank: { type: String },
    accountBank: { type: String },
    accountType: { type: String },
    numberCheck: { type: String },
    bankCheck: { type: String },
    discount: { type: Number },
    increase: { type: Number },
    observationTreasury: { type: String },
    //Financiero
    payments: { type: String },
    typePayments: { type: String },
    //tesoreria 2
    accreditedPayment: { type: Number },
    difference: { type: Number },
    treasuryFile: { type: CloudImageSchema },
    debitNote: { type: String },
  },
  { timestamps: true }
);

// Duplicate the ID field.
FactureBalconSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
FactureBalconSchema.set("toJSON", {
  virtuals: true,
});

const FactureRecaudacionesSchema = new mongoose.Schema<FactureRecaudaciones>(
  {
    //Solicitante
    project: { type: ProjectSchema },
    centerCost: { type: CenterSchema },
    centerCostIg: { type: CenterIgSchema },
    centerCostCalderon: { type: CenterCalderonSchema },
    centerCostBalcon: { type: CenterBalconSchema },
    provider: { type: ProviderSchema },
    providerIg: { type: ProviderIgSchema },
    email: { type: ProviderSchema },
    providerCalderon: { type: ProviderCalderonSchema },
    providerBalcon: { type: ProviderBalconSchema },
    providerRecaudaciones: { type: ProviderRecaudacionesSchema },
    factureDate: { type: String },
    factureNumber: { type: Number },
    details: { type: String },
    value: { type: Number },
    accountTypeB: { type: String },
    file: { type: CloudImageSchema },
    observation: { type: String },
    typeCard: { type: String },
    codBank: { type: String },
    typeProv: { type: String },
    //contabilidad
    numberRetention: { type: Number },
    valueRetention: { type: Number },
    valueNet: { type: Number },
    documentDelivered: { type: String },
    observationConta: { type: String },
    closingSeat: { type: String },
    //tesoreria
    beneficiary: { type: String },
    identificationCard: {
      type: String,
      // minlength: [10, 'min length of dni'],
      // maxlength: [13, 'max length of ruc'],
    },
    bank: { type: String },
    accountBank: { type: String },
    accountType: { type: String },
    numberCheck: { type: String },
    bankCheck: { type: String },
    discount: { type: Number },
    increase: { type: Number },
    observationTreasury: { type: String },
    //Financiero
    payments: { type: String },
    typePayments: { type: String },
    //tesoreria 2
    accreditedPayment: { type: Number },
    difference: { type: Number },
    treasuryFile: { type: CloudImageSchema },
    debitNote: { type: String },
  },
  { timestamps: true }
);

// Duplicate the ID field.
FactureRecaudacionesSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
FactureRecaudacionesSchema.set("toJSON", {
  virtuals: true,
});

const FactureAdvanceSchema = new mongoose.Schema<FactureAdvance>(
  {
    //Solicitante
    project: { type: ProjectSchema },
    centerCost: { type: CenterSchema },
    centerCostIg: { type: CenterIgSchema },
    centerCostCalderon: { type: CenterCalderonSchema },
    centerCostBalcon: { type: CenterBalconSchema },
    provider: { type: ProviderSchema },
    email: { type: ProviderSchema },
    providerIg: { type: ProviderIgSchema },
    providerCalderon: { type: ProviderCalderonSchema },
    providerBalcon: { type: ProviderBalconSchema },
    providerRecaudaciones: { type: ProviderRecaudacionesSchema },
    details: { type: String },
    value: { type: Number },
    file: { type: CloudImageSchema },
    typeCard: { type: String },
    codBank: { type: String },
    typeProv: { type: String },
    //Tesoreria
    beneficiary: { type: String },
    identificationCard: {
      type: String,
      // minlength: [10, 'min length of dni'],
      // maxlength: [13, 'max length of ruc'],
    },
    bank: { type: String },
    accountBank: { type: String },
    accountType: { type: String },
    accountTypeB: { type: String },
    increase: { type: Number },
    observationTreasury: { type: String },
    //Financiero
    payments: { type: String },
    typePayments: { type: String },
    //Tesoreria 2
    accreditedPayment: { type: Number },
    difference: { type: Number },
    treasuryFile: { type: CloudImageSchema },
    numberCheck: { type: String },
    bankCheck: { type: String },
    discount: { type: Number },
    debitNote: { type: String },
    //contabilidad
    numberRetention: { type: Number },
    factureDate: { type: String },
    factureNumber: { type: Number },
    valueRetention: { type: Number },
    valueNet: { type: Number },
    documentDelivered: { type: String },
    observationConta: { type: String },
    closingSeat: { type: String },
  },
  { timestamps: true }
);

// Duplicate the ID field.
FactureAdvanceSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
FactureAdvanceSchema.set("toJSON", {
  virtuals: true,
});

const FactureAdvanceInmogestionSchema =
  new mongoose.Schema<FactureAdvanceInmogestion>(
    {
      //Solicitante
      project: { type: ProjectSchema },
      centerCost: { type: CenterSchema },
      centerCostIg: { type: CenterIgSchema },
      centerCostCalderon: { type: CenterCalderonSchema },
      centerCostBalcon: { type: CenterBalconSchema },
      provider: { type: ProviderSchema },
      email: { type: ProviderSchema },
      providerIg: { type: ProviderIgSchema },
      providerCalderon: { type: ProviderCalderonSchema },
      providerBalcon: { type: ProviderBalconSchema },
      providerRecaudaciones: { type: ProviderRecaudacionesSchema },
      details: { type: String },
      value: { type: Number },
      file: { type: CloudImageSchema },
      typeCard: { type: String },
      accountTypeB: { type: String },
      codBank: { type: String },
      typeProv: { type: String },
      //Tesoreria
      beneficiary: { type: String },
      identificationCard: {
        type: String,
        // minlength: [10, 'min length of dni'],
        // maxlength: [13, 'max length of ruc'],
      },
      bank: { type: String },
      accountBank: { type: String },
      accountType: { type: String },
      increase: { type: Number },
      observationTreasury: { type: String },
      //Financiero
      payments: { type: String },
      typePayments: { type: String },
      //Tesoreria 2
      accreditedPayment: { type: Number },
      difference: { type: Number },
      treasuryFile: { type: CloudImageSchema },
      numberCheck: { type: String },
      bankCheck: { type: String },
      discount: { type: Number },
      debitNote: { type: String },
      //contabilidad
      numberRetention: { type: Number },
      factureDate: { type: String },
      factureNumber: { type: Number },
      valueRetention: { type: Number },
      valueNet: { type: Number },
      documentDelivered: { type: String },
      observationConta: { type: String },
      closingSeat: { type: String },
    },
    { timestamps: true }
  );

// Duplicate the ID field.
FactureAdvanceInmogestionSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
FactureAdvanceInmogestionSchema.set("toJSON", {
  virtuals: true,
});

const FactureAdvanceCalderonSchema =
  new mongoose.Schema<FactureAdvanceCalderon>(
    {
      //Solicitante
      project: { type: ProjectSchema },
      centerCost: { type: CenterSchema },
      centerCostIg: { type: CenterIgSchema },
      centerCostCalderon: { type: CenterCalderonSchema },
      centerCostBalcon: { type: CenterBalconSchema },
      provider: { type: ProviderSchema },
      email: { type: ProviderSchema },
      providerIg: { type: ProviderIgSchema },
      providerCalderon: { type: ProviderCalderonSchema },
      providerBalcon: { type: ProviderBalconSchema },
      providerRecaudaciones: { type: ProviderRecaudacionesSchema },
      details: { type: String },
      value: { type: Number },
      file: { type: CloudImageSchema },
      typeCard: { type: String },
      codBank: { type: String },
      typeProv: { type: String },
      //Tesoreria
      beneficiary: { type: String },
      identificationCard: {
        type: String,
        // minlength: [10, 'min length of dni'],
        // maxlength: [13, 'max length of ruc'],
      },
      bank: { type: String },
      accountBank: { type: String },
      accountType: { type: String },
      increase: { type: Number },
      observationTreasury: { type: String },
      //Financiero
      payments: { type: String },
      typePayments: { type: String },
      //Tesoreria 2
      accreditedPayment: { type: Number },
      difference: { type: Number },
      treasuryFile: { type: CloudImageSchema },
      numberCheck: { type: String },
      bankCheck: { type: String },
      discount: { type: Number },
      accountTypeB: { type: String },
      debitNote: { type: String },
      //contabilidad
      numberRetention: { type: Number },
      factureDate: { type: String },
      factureNumber: { type: Number },
      valueRetention: { type: Number },
      valueNet: { type: Number },
      documentDelivered: { type: String },
      closingSeat: { type: String },
      observationConta: { type: String },
    },
    { timestamps: true }
  );

// Duplicate the ID field.
FactureAdvanceCalderonSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
FactureAdvanceCalderonSchema.set("toJSON", {
  virtuals: true,
});

const FactureAdvanceBalconSchema = new mongoose.Schema<FactureAdvanceBalcon>(
  {
    //Solicitante
    project: { type: ProjectSchema },
    centerCost: { type: CenterSchema },
    centerCostIg: { type: CenterIgSchema },
    centerCostCalderon: { type: CenterCalderonSchema },
    centerCostBalcon: { type: CenterBalconSchema },
    email: { type: ProviderSchema },
    provider: { type: ProviderSchema },
    providerIg: { type: ProviderIgSchema },
    providerCalderon: { type: ProviderCalderonSchema },
    providerBalcon: { type: ProviderBalconSchema },
    providerRecaudaciones: { type: ProviderRecaudacionesSchema },
    details: { type: String },
    value: { type: Number },
    file: { type: CloudImageSchema },
    typeCard: { type: String },
    codBank: { type: String },
    typeProv: { type: String },
    //Tesoreria
    beneficiary: { type: String },
    accountTypeB: { type: String },
    identificationCard: {
      type: String,
      // minlength: [10, 'min length of dni'],
      // maxlength: [13, 'max length of ruc'],
    },
    bank: { type: String },
    accountBank: { type: String },
    accountType: { type: String },
    increase: { type: Number },
    observationTreasury: { type: String },
    //Financiero
    payments: { type: String },
    typePayments: { type: String },
    //Tesoreria 2
    accreditedPayment: { type: Number },
    difference: { type: Number },
    treasuryFile: { type: CloudImageSchema },
    numberCheck: { type: String },
    bankCheck: { type: String },
    discount: { type: Number },
    debitNote: { type: String },
    //contabilidad
    numberRetention: { type: Number },
    factureDate: { type: String },
    factureNumber: { type: Number },
    valueRetention: { type: Number },
    valueNet: { type: Number },
    documentDelivered: { type: String },
    closingSeat: { type: String },
    observationConta: { type: String },
  },
  { timestamps: true }
);

// Duplicate the ID field.
FactureAdvanceBalconSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
FactureAdvanceBalconSchema.set("toJSON", {
  virtuals: true,
});

const FactureAdvanceRecaudacionesSchema =
  new mongoose.Schema<FactureAdvanceRecaudaciones>(
    {
      //Solicitante
      project: { type: ProjectSchema },
      centerCost: { type: CenterSchema },
      centerCostIg: { type: CenterIgSchema },
      centerCostCalderon: { type: CenterCalderonSchema },
      centerCostBalcon: { type: CenterBalconSchema },
      provider: { type: ProviderSchema },
      email: { type: ProviderSchema },
      providerIg: { type: ProviderIgSchema },
      providerCalderon: { type: ProviderCalderonSchema },
      providerBalcon: { type: ProviderBalconSchema },
      providerRecaudaciones: { type: ProviderRecaudacionesSchema },
      details: { type: String },
      value: { type: Number },
      file: { type: CloudImageSchema },
      accountTypeB: { type: String },
      typeCard: { type: String },
      codBank: { type: String },
      typeProv: { type: String },
      //Tesoreria
      beneficiary: { type: String },
      identificationCard: {
        type: String,
        // minlength: [10, 'min length of dni'],
        // maxlength: [13, 'max length of ruc'],
      },
      bank: { type: String },
      accountBank: { type: String },
      accountType: { type: String },
      increase: { type: Number },
      observationTreasury: { type: String },
      //Financiero
      payments: { type: String },
      typePayments: { type: String },
      //Tesoreria 2
      accreditedPayment: { type: Number },
      difference: { type: Number },
      treasuryFile: { type: CloudImageSchema },
      numberCheck: { type: String },
      bankCheck: { type: String },
      discount: { type: Number },
      debitNote: { type: String },
      //contabilidad
      numberRetention: { type: Number },
      factureDate: { type: String },
      factureNumber: { type: Number },
      valueRetention: { type: Number },
      valueNet: { type: Number },
      documentDelivered: { type: String },
      closingSeat: { type: String },
      observationConta: { type: String },
    },
    { timestamps: true }
  );

// Duplicate the ID field.
FactureAdvanceRecaudacionesSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
FactureAdvanceRecaudacionesSchema.set("toJSON", {
  virtuals: true,
});

//Comentarios
const CommentSchema = new mongoose.Schema<Comment>(
  {
    userComment: { type: String },
    dateComment: { type: String },
    messageComment: { type: String },
  },
  { timestamps: true }
);

CommentSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

CommentSchema.set("toJSON", {
  virtuals: true,
});

export const CommentModel =
  mongoose.models.Comments || mongoose.model("Comments", CommentSchema);

//Solicitudes
const SolicitudeSchema = new mongoose.Schema<Solicitude>(
  {
    number: { type: Number },
    soliciter: { type: String },
    date: { type: String },
    details: { type: String },
    soliciterState: { type: String },
    contableState: { type: String },
    contableAdvanceState: { type: String },
    imageTreasuryState: { type: String },
    advanceState: { type: String },
    paymentTreasuryState: { type: String },
    financialState: { type: String },
    items: { type: [FactureSchema] },
    applicantDate: { type: String },
    treasuryDate: { type: String },
    financialDate: { type: String },
    advanceDate: { type: String },
    contableAdvanceDate: { type: String },
    accountantDate: { type: String },
    imageTreasuryDate: { type: String },
    itemsComment: { type: [CommentSchema] },
  },
  { timestamps: true }
);

// Duplicate the ID field.
SolicitudeSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Calculate total from factures.
SolicitudeSchema.virtual("total").get(function () {
  let total = 0;
  this.items.forEach((element: Facture) => (total += element.value ?? 0));
  return total;
});

// Ensure virtual fields are serialised.
SolicitudeSchema.set("toJSON", {
  virtuals: true,
});

export const SolicitudeModel =
  mongoose.models.Solicitudes ||
  mongoose.model("Solicitudes", SolicitudeSchema);

const SolicitudeInmogestionSchema = new mongoose.Schema<SolicitudeInmogestion>(
  {
    number: { type: Number },
    soliciter: { type: String },
    date: { type: String },
    details: { type: String },
    soliciterState: { type: String },
    contableState: { type: String },
    contableAdvanceState: { type: String },
    imageTreasuryState: { type: String },
    advanceState: { type: String },
    paymentTreasuryState: { type: String },
    financialState: { type: String },
    items: { type: [FactureSchema] },
    applicantDate: { type: String },
    treasuryDate: { type: String },
    financialDate: { type: String },
    advanceDate: { type: String },
    contableAdvanceDate: { type: String },
    accountantDate: { type: String },
    imageTreasuryDate: { type: String },
    itemsComment: { type: [CommentSchema] },
  },
  { timestamps: true }
);

// Duplicate the ID field.
SolicitudeInmogestionSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Calculate total from factures.
SolicitudeInmogestionSchema.virtual("total").get(function () {
  let total = 0;
  this.items.forEach((element: Facture) => (total += element.value ?? 0));
  return total;
});

// Ensure virtual fields are serialised.
SolicitudeInmogestionSchema.set("toJSON", {
  virtuals: true,
});

export const SolicitudeInmogestionModel =
  mongoose.models.SolicitudesInmogestion ||
  mongoose.model("SolicitudesInmogestion", SolicitudeInmogestionSchema);

const SolicitudeCalderonSchema = new mongoose.Schema<SolicitudeCalderon>(
  {
    number: { type: Number },
    soliciter: { type: String },
    date: { type: String },
    details: { type: String },
    soliciterState: { type: String },
    contableState: { type: String },
    contableAdvanceState: { type: String },
    imageTreasuryState: { type: String },
    advanceState: { type: String },
    paymentTreasuryState: { type: String },
    financialState: { type: String },
    items: { type: [FactureSchema] },
    applicantDate: { type: String },
    treasuryDate: { type: String },
    financialDate: { type: String },
    advanceDate: { type: String },
    contableAdvanceDate: { type: String },
    accountantDate: { type: String },
    imageTreasuryDate: { type: String },
    itemsComment: { type: [CommentSchema] },
  },
  { timestamps: true }
);

// Duplicate the ID field.
SolicitudeCalderonSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Calculate total from factures.
SolicitudeCalderonSchema.virtual("total").get(function () {
  let total = 0;
  this.items.forEach((element: Facture) => (total += element.value ?? 0));
  return total;
});

// Ensure virtual fields are serialised.
SolicitudeCalderonSchema.set("toJSON", {
  virtuals: true,
});

export const SolicitudeCalderonModel =
  mongoose.models.SolicitudesCalderon ||
  mongoose.model("SolicitudesCalderon", SolicitudeCalderonSchema);

const SolicitudeBalconSchema = new mongoose.Schema<SolicitudeBalcon>(
  {
    number: { type: Number },
    soliciter: { type: String },
    date: { type: String },
    details: { type: String },
    soliciterState: { type: String },
    contableState: { type: String },
    contableAdvanceState: { type: String },
    imageTreasuryState: { type: String },
    advanceState: { type: String },
    paymentTreasuryState: { type: String },
    financialState: { type: String },
    items: { type: [FactureSchema] },
    applicantDate: { type: String },
    treasuryDate: { type: String },
    financialDate: { type: String },
    advanceDate: { type: String },
    contableAdvanceDate: { type: String },
    accountantDate: { type: String },
    imageTreasuryDate: { type: String },
    itemsComment: { type: [CommentSchema] },
  },
  { timestamps: true }
);

// Duplicate the ID field.
SolicitudeBalconSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Calculate total from factures.
SolicitudeBalconSchema.virtual("total").get(function () {
  let total = 0;
  this.items.forEach((element: Facture) => (total += element.value ?? 0));
  return total;
});

// Ensure virtual fields are serialised.
SolicitudeBalconSchema.set("toJSON", {
  virtuals: true,
});

export const SolicitudeBalconModel =
  mongoose.models.SolicitudesBalcon ||
  mongoose.model("SolicitudesBalcon", SolicitudeBalconSchema);

const SolicitudeRecaudacionesSchema =
  new mongoose.Schema<SolicitudeRecaudaciones>(
    {
      number: { type: Number },
      soliciter: { type: String },
      date: { type: String },
      details: { type: String },
      soliciterState: { type: String },
      contableState: { type: String },
      contableAdvanceState: { type: String },
      imageTreasuryState: { type: String },
      advanceState: { type: String },
      paymentTreasuryState: { type: String },
      financialState: { type: String },
      items: { type: [FactureSchema] },
      applicantDate: { type: String },
      treasuryDate: { type: String },
      financialDate: { type: String },
      advanceDate: { type: String },
      contableAdvanceDate: { type: String },
      accountantDate: { type: String },
      imageTreasuryDate: { type: String },
      itemsComment: { type: [CommentSchema] },
    },
    { timestamps: true }
  );

// Duplicate the ID field.
SolicitudeRecaudacionesSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Calculate total from factures.
SolicitudeRecaudacionesSchema.virtual("total").get(function () {
  let total = 0;
  this.items.forEach((element: Facture) => (total += element.value ?? 0));
  return total;
});

// Ensure virtual fields are serialised.
SolicitudeRecaudacionesSchema.set("toJSON", {
  virtuals: true,
});

export const SolicitudeRecaudacionesModel =
  mongoose.models.SolicitudesRecaudaciones ||
  mongoose.model("SolicitudesRecaudaciones", SolicitudeRecaudacionesSchema);
//Anticipos

const AdvanceSchema = new mongoose.Schema<Advance>(
  {
    number: { type: Number },
    soliciter: { type: String },
    date: { type: String },
    details: { type: String },
    soliciterState: { type: String },
    contableAdvanceState: { type: String },
    advanceState: { type: String },
    imageTreasuryState: { type: String },
    paymentTreasuryState: { type: String },
    financialState: { type: String },
    items: { type: [FactureSchema] },
    applicantDate: { type: String },
    treasuryDate: { type: String },
    financialDate: { type: String },
    advanceDate: { type: String },
    contableAdvanceDate: { type: String },
    accountantDate: { type: String },
    imageTreasuryDate: { type: String },
    itemsComment: { type: [CommentSchema] },
  },
  { timestamps: true }
);

// Duplicate the ID field.
AdvanceSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Calculate total from factures.
AdvanceSchema.virtual("total").get(function () {
  let total = 0;
  this.items.forEach(
    (element: FactureAdvance) => (total += element.value ?? 0)
  );
  return total;
});

// Ensure virtual fields are serialised.
AdvanceSchema.set("toJSON", {
  virtuals: true,
});

export const AdvanceModel =
  mongoose.models.Advances || mongoose.model("Advances", AdvanceSchema);

const AdvanceInmogestionSchema = new mongoose.Schema<AdvanceInmogestion>(
  {
    number: { type: Number },
    soliciter: { type: String },
    date: { type: String },
    details: { type: String },
    soliciterState: { type: String },
    contableAdvanceState: { type: String },
    advanceState: { type: String },
    imageTreasuryState: { type: String },
    paymentTreasuryState: { type: String },
    financialState: { type: String },
    items: { type: [FactureSchema] },
    applicantDate: { type: String },
    treasuryDate: { type: String },
    financialDate: { type: String },
    advanceDate: { type: String },
    contableAdvanceDate: { type: String },
    accountantDate: { type: String },
    imageTreasuryDate: { type: String },
    itemsComment: { type: [CommentSchema] },
  },
  { timestamps: true }
);

// Duplicate the ID field.
AdvanceInmogestionSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Calculate total from factures.
AdvanceInmogestionSchema.virtual("total").get(function () {
  let total = 0;
  this.items.forEach(
    (element: FactureAdvance) => (total += element.value ?? 0)
  );
  return total;
});

// Ensure virtual fields are serialised.
AdvanceInmogestionSchema.set("toJSON", {
  virtuals: true,
});

export const AdvanceInmogestionModel =
  mongoose.models.AdvancesInmogestion ||
  mongoose.model("AdvancesInmogestion", AdvanceInmogestionSchema);

const AdvanceCalderonSchema = new mongoose.Schema<AdvanceCalderon>(
  {
    number: { type: Number },
    soliciter: { type: String },
    date: { type: String },
    details: { type: String },
    soliciterState: { type: String },
    contableAdvanceState: { type: String },
    advanceState: { type: String },
    imageTreasuryState: { type: String },
    paymentTreasuryState: { type: String },
    financialState: { type: String },
    items: { type: [FactureSchema] },
    applicantDate: { type: String },
    treasuryDate: { type: String },
    financialDate: { type: String },
    advanceDate: { type: String },
    contableAdvanceDate: { type: String },
    accountantDate: { type: String },
    imageTreasuryDate: { type: String },
    itemsComment: { type: [CommentSchema] },
  },
  { timestamps: true }
);

// Duplicate the ID field.
AdvanceCalderonSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Calculate total from factures.
AdvanceCalderonSchema.virtual("total").get(function () {
  let total = 0;
  this.items.forEach(
    (element: FactureAdvance) => (total += element.value ?? 0)
  );
  return total;
});

// Ensure virtual fields are serialised.
AdvanceCalderonSchema.set("toJSON", {
  virtuals: true,
});

export const AdvanceCalderonModel =
  mongoose.models.AdvancesCalderon ||
  mongoose.model("AdvancesCalderon", AdvanceCalderonSchema);

const AdvanceBalconSchema = new mongoose.Schema<AdvanceBalcon>(
  {
    number: { type: Number },
    soliciter: { type: String },
    date: { type: String },
    details: { type: String },
    soliciterState: { type: String },
    contableAdvanceState: { type: String },
    advanceState: { type: String },
    imageTreasuryState: { type: String },
    paymentTreasuryState: { type: String },
    financialState: { type: String },
    items: { type: [FactureSchema] },
    applicantDate: { type: String },
    treasuryDate: { type: String },
    financialDate: { type: String },
    advanceDate: { type: String },
    contableAdvanceDate: { type: String },
    accountantDate: { type: String },
    imageTreasuryDate: { type: String },
    itemsComment: { type: [CommentSchema] },
  },
  { timestamps: true }
);

// Duplicate the ID field.
AdvanceBalconSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Calculate total from factures.
AdvanceBalconSchema.virtual("total").get(function () {
  let total = 0;
  this.items.forEach(
    (element: FactureAdvance) => (total += element.value ?? 0)
  );
  return total;
});

// Ensure virtual fields are serialised.
AdvanceBalconSchema.set("toJSON", {
  virtuals: true,
});

export const AdvanceBalconModel =
  mongoose.models.AdvancesBalcon ||
  mongoose.model("AdvancesBalcon", AdvanceBalconSchema);

const AdvanceRecaudacionesSchema = new mongoose.Schema<AdvanceRecaudaciones>(
  {
    number: { type: Number },
    soliciter: { type: String },
    date: { type: String },
    details: { type: String },
    soliciterState: { type: String },
    contableAdvanceState: { type: String },
    advanceState: { type: String },
    imageTreasuryState: { type: String },
    paymentTreasuryState: { type: String },
    financialState: { type: String },
    items: { type: [FactureSchema] },
    applicantDate: { type: String },
    treasuryDate: { type: String },
    financialDate: { type: String },
    advanceDate: { type: String },
    contableAdvanceDate: { type: String },
    accountantDate: { type: String },
    imageTreasuryDate: { type: String },
    itemsComment: { type: [CommentSchema] },
  },
  { timestamps: true }
);

// Duplicate the ID field.
AdvanceRecaudacionesSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Calculate total from factures.
AdvanceRecaudacionesSchema.virtual("total").get(function () {
  let total = 0;
  this.items.forEach(
    (element: FactureAdvance) => (total += element.value ?? 0)
  );
  return total;
});

// Ensure virtual fields are serialised.
AdvanceRecaudacionesSchema.set("toJSON", {
  virtuals: true,
});

export const AdvanceRecaudacionesModel =
  mongoose.models.AdvancesRecaudaciones ||
  mongoose.model("AdvancesRecaudaciones", AdvanceRecaudacionesSchema);

const EmployeesSchema = new mongoose.Schema<Employees>(
  {
    beneficiary: { type: String },
    position: { type: String },
    department: { type: String },
    bank: { type: String },
    identificationCard: { type: String },
    accountBank: { type: String },
    accountType: { type: String },
    typeCard: { type: String },
    codBank: { type: String },
  },
  { timestamps: true }
);

EmployeesSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
EmployeesSchema.set("toJSON", {
  virtuals: true,
});

export const EmployeesModel =
  mongoose.models.Employeeses || mongoose.model("Employeeses", EmployeesSchema);

const FactureEmployeesSchema = new mongoose.Schema<FactureEmployees>(
  {
    beneficiary: { type: String },
    identificationCard: { type: String },
    bank: { type: String },
    accountBank: { type: String },
    accountType: { type: String },
    typeCard: { type: String },
    codBank: { type: String },
    typeProv: { type: String },
    value: { type: String },
    position: { type: String },
    department: { type: String },
  },
  { timestamps: true }
);

FactureEmployeesSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

FactureEmployeesSchema.set("toJSON", {
  virtuals: true,
});

const NominaSchema = new mongoose.Schema<Nomina>(
  {
    number: { type: Number },
    soliciter: { type: String },
    soliciterState: { type: String },
    date: { type: String },
    details: { type: String },
    items: { type: [FactureEmployeesSchema] },
    state: { type: String },
    month: { type: String },
  },
  { timestamps: true }
);

NominaSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

NominaSchema.virtual("total").get(function () {
  let total = 0;
  this.items.forEach(
    (element: FactureEmployees) => (total += parseFloat(element.value) ?? 0)
  );
  return total;
});

NominaSchema.set("toJSON", {
  virtuals: true,
});

export const NominaModel =
  mongoose.models.Nominas || mongoose.model("Nominas", NominaSchema);

const BackupSchema = new mongoose.Schema<Backup>(
  {
    solicitude: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "solicitudes",
    },
  },
  { timestamps: true }
);

// Duplicate the ID field.
BackupSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
BackupSchema.set("toJSON", {
  virtuals: true,
});

export const BackupModel =
  mongoose.models.Backups || mongoose.model("Backups", BackupSchema);

const BackupInmogestionSchema = new mongoose.Schema<Backup>(
  {
    solicitudeInmogestion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "solicitudesInmogestion",
    },
  },
  { timestamps: true }
);

// Duplicate the ID field.
BackupInmogestionSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
BackupInmogestionSchema.set("toJSON", {
  virtuals: true,
});

export const BackupInmogestionModel =
  mongoose.models.BackupsInmogestion ||
  mongoose.model("BackupsInmogestion", BackupInmogestionSchema);

const BackupCalderonSchema = new mongoose.Schema<Backup>(
  {
    solicitudeCalderon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "solicitudesCalderon",
    },
  },
  { timestamps: true }
);

// Duplicate the ID field.
BackupCalderonSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
BackupCalderonSchema.set("toJSON", {
  virtuals: true,
});

export const BackupCalderonModel =
  mongoose.models.BackupsCalderon ||
  mongoose.model("BackupsCalderon", BackupCalderonSchema);

const BackupBalconSchema = new mongoose.Schema<Backup>(
  {
    solicitudeBalcon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "solicitudesBalcon",
    },
  },
  { timestamps: true }
);

// Duplicate the ID field.
BackupBalconSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
BackupBalconSchema.set("toJSON", {
  virtuals: true,
});

export const BackupBalconModel =
  mongoose.models.BackupsBalcon ||
  mongoose.model("BackupsBalcon", BackupBalconSchema);

const BackupRecaudacionesSchema = new mongoose.Schema<Backup>(
  {
    solicitudeCalderon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "solicitudesCalderon",
    },
  },
  { timestamps: true }
);

// Duplicate the ID field.
BackupRecaudacionesSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
BackupRecaudacionesSchema.set("toJSON", {
  virtuals: true,
});

export const BackupRecaudacionesModel =
  mongoose.models.BackupsRecaudaciones ||
  mongoose.model("BackupsRecaudaciones", BackupRecaudacionesSchema);

const BackupAdvanceSchema = new mongoose.Schema<Backup>(
  {
    advance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "advances",
    },
  },
  { timestamps: true }
);

// Duplicate the ID field.
BackupAdvanceSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
BackupAdvanceSchema.set("toJSON", {
  virtuals: true,
});

export const BackupAdvanceModel =
  mongoose.models.BackupsAdvance ||
  mongoose.model("BackupsAdvance", BackupAdvanceSchema);

const BackupAdvanceInmogestionSchema = new mongoose.Schema<Backup>(
  {
    advanceInmogestion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "advancesInmogestion",
    },
  },
  { timestamps: true }
);

// Duplicate the ID field.
BackupAdvanceInmogestionSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
BackupAdvanceInmogestionSchema.set("toJSON", {
  virtuals: true,
});

export const BackupAdvanceInmogestionModel =
  mongoose.models.BackupsAdvanceInmogestion ||
  mongoose.model("BackupsAdvanceInmogestion", BackupAdvanceInmogestionSchema);

const BackupAdvanceCalderonSchema = new mongoose.Schema<Backup>(
  {
    advanceCalderon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "advancesCalderon",
    },
  },
  { timestamps: true }
);

// Duplicate the ID field.
BackupAdvanceCalderonSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
BackupAdvanceCalderonSchema.set("toJSON", {
  virtuals: true,
});

export const BackupAdvanceCalderonModel =
  mongoose.models.BackupsAdvanceCalderon ||
  mongoose.model("BackupsAdvanceCalderon", BackupAdvanceCalderonSchema);

const BackupAdvanceBalconSchema = new mongoose.Schema<Backup>(
  {
    advanceBalcon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "advancesBalcon",
    },
  },
  { timestamps: true }
);

// Duplicate the ID field.
BackupAdvanceBalconSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
BackupAdvanceBalconSchema.set("toJSON", {
  virtuals: true,
});

export const BackupAdvanceBalconModel =
  mongoose.models.BackupsAdvanceBalcon ||
  mongoose.model("BackupsAdvanceBalcon", BackupAdvanceBalconSchema);

const BackupAdvanceRecaudacionesSchema = new mongoose.Schema<Backup>(
  {
    advanceRecaudaciones: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "advancesRecaudaciones",
    },
  },
  { timestamps: true }
);

// Duplicate the ID field.
BackupAdvanceRecaudacionesSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
BackupAdvanceRecaudacionesSchema.set("toJSON", {
  virtuals: true,
});

export const BackupAdvanceRecaudacionesModel =
  mongoose.models.BackupsAdvanceRecaudaciones ||
  mongoose.model(
    "BackupsAdvanceRecaudaciones",
    BackupAdvanceRecaudacionesSchema
  );

const BackupNominaSchema = new mongoose.Schema<Backup>(
  {
    nomina: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "nominas",
    },
  },
  { timestamps: true }
);

BackupNominaSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

BackupNominaSchema.set("toJSON", {
  virtuals: true,
});

export const BackupNominaModel =
  mongoose.models.BackupsNomina ||
  mongoose.model("BackupsNomina", BackupNominaSchema);

const DeparmentSchema = new mongoose.Schema<UserDeparment>(
  {
    name: { type: String },
  },
  { timestamps: true }
);

// Duplicate the ID field.
DeparmentSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
DeparmentSchema.set("toJSON", {
  virtuals: true,
});

export const DeparmentModel =
  mongoose.models.Deparments || mongoose.model("Deparments", DeparmentSchema);

  const HolidaysSchema = new mongoose.Schema<Holidays>(
    {
      number: { type: Number },
      soliciter: { type: String },
      deparmentSoliciter: { type: String },
      soliciterId: { type: String },
      typePermissions: { type: String },
      details: { type: String },
      state: { type: String },
      date: { type: String },
      dateE: { type: String },
      dateS: { type: String },
      dateState: { type: String },
      requestedDays: { type: Number },
      requestedHour: { type: String },
      startTime: { type: String },
      finalTime: { type: String },
      observation: { type: String },
    },
    { timestamps: true }
  );
  
  // Duplicate the ID field.
  HolidaysSchema.virtual("id").get(function () {
    return this._id.toHexString();
  });
  
  // Ensure virtual fields are serialised.
  HolidaysSchema.set("toJSON", {
    virtuals: true,
  });
  
  export const HolidaysModel =
    mongoose.models.Holidays ||
    mongoose.model("Holidays", HolidaysSchema);
  
  const PermissionSchema = new mongoose.Schema<Permission>(
    {
      number: { type: Number },
      soliciter: { type: String },
      deparmentSoliciter: { type: String },
      soliciterId: { type: String },
      typePermissions: { type: String },
      details: { type: String },
      state: { type: String },
      date: { type: String },
      dateE: { type: String },
      dateS: { type: String },
      dateState: { type: String },
      requestedDays: { type: Number },
      requestedHour: { type: String },
      startTime: { type: String },
      finalTime: { type: String },
      observation: { type: String },
    },
    { timestamps: true }
  );
  
  // Duplicate the ID field.
  PermissionSchema.virtual("id").get(function () {
    return this._id.toHexString();
  });
  
  // Ensure virtual fields are serialised.
  PermissionSchema.set("toJSON", {
    virtuals: true,
  });
  
  export const PermissionModel =
    mongoose.models.Permissions ||
    mongoose.model("Permissions", PermissionSchema);
  
  const LoanSchema = new mongoose.Schema<Loan>(
    {
      number: { type: Number },
      soliciter: { type: String },
      deparmentSoliciter: { type: String },
      soliciterId: { type: String },
      typePermissions: { type: String },
      details: { type: String },
      state: { type: String },
      date: { type: String },
      dateE: { type: String },
      dateS: { type: String },
      dateState: { type: String },
      requestedDays: { type: Number },
      requestedHour: { type: String },
      startTime: { type: String },
      finalTime: { type: String },
      observation: { type: String },
    },
    { timestamps: true }
  );
  
  LoanSchema.virtual("id").get(function () {
    return this._id.toHexString();
  });
  
  LoanSchema.set("toJSON", {
    virtuals: true,
  });
  
  export const LoanModel =
    mongoose.models.Loans || mongoose.model("Loans", LoanSchema);
  
  const BackupHolidaysSchema = new mongoose.Schema<Backup>(
    {
      holidays: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "holidays",
      },
    },
    { timestamps: true }
  );
  
  // Duplicate the ID field.
  BackupHolidaysSchema.virtual("id").get(function () {
    return this._id.toHexString();
  });
  
  // Ensure virtual fields are serialised.
  BackupHolidaysSchema.set("toJSON", {
    virtuals: true,
  });
  
  export const BackupHolidaysModel =
    mongoose.models.BackupsHolidays || mongoose.model("BackupsHolidays", BackupHolidaysSchema);
  
  const BackupPermissionSchema = new mongoose.Schema<Backup>(
    {
      permission: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "permissions",
      },
    },
    { timestamps: true }
  );
  
  // Duplicate the ID field.
  BackupPermissionSchema.virtual("id").get(function () {
    return this._id.toHexString();
  });
  
  // Ensure virtual fields are serialised.
  BackupPermissionSchema.set("toJSON", {
    virtuals: true,
  });
  
  export const BackupPermissionModel =
    mongoose.models.BackupsPermissions ||
    mongoose.model("BackupsPermissions", BackupPermissionSchema);
  
  const BackupLoanSchema = new mongoose.Schema<Backup>(
    {
      loan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "loans",
      },
    },
    { timestamps: true }
  );
  
  BackupLoanSchema.virtual("id").get(function () {
    return this._id.toHexString();
  });
  
  BackupLoanSchema.set("toJSON", {
    virtuals: true,
  });
  
  export const BackupLoanModel =
    mongoose.models.BackupLoans ||
    mongoose.model("BackupLoans", BackupLoanSchema);

const UserSchema = new mongoose.Schema<User>(
  {
    userName: { type: String },
    password: { type: String },
    email: { type: String },
    department: { type: String },
    role: { type: Number },
    name: { type: String },
    identificationCard: { type: String },
    dateBirth: { type: String },
    age: { type: Number },
    dateAdmission: { type: String },
    position: { type: String },
    cellphone: { type: String },
    holidays: { type: String },
    yearsWorked: { type: String },
    bussines: { type: String },
    discount: { type: String },
    count: { type: String },
    countPermission: { type: Number },
  },
  { timestamps: true }
);

// Duplicate the ID field.
UserSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
UserSchema.set("toJSON", {
  virtuals: true,
});

export const UserModel =
  mongoose.models.Users || mongoose.model("Users", UserSchema);

const AuditorySchema = new mongoose.Schema<Auditory>(
  {
    date: { type: String },
    user: { type: String },
    action: { type: String },
  },
  { timestamps: true }
);

// Duplicate the ID field.
AuditorySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
AuditorySchema.set("toJSON", {
  virtuals: true,
});

export const AuditoryModel =
  mongoose.models.Auditory || mongoose.model("Auditory", AuditorySchema);
