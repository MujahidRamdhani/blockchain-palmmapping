/*
  SPDX-License-Identifier: Apache-2.0
*/

import {Object, Property} from 'fabric-contract-api';

@Object()
export class PemetaanHutan {
    @Property()
    public idHutan: string;
 
    @Property()
    public namaHutan: string;

    @Property()
    public longitude: string;

    @Property()
    public latitude: string;
    
    @Property()
    public luasHutan: string;

    @Property()
    public nipSurveyor: string;

    @Property()
    public namaSurveyor: string;

    @Property()
    public waktuPemetaanHutan: string;

    @Property()
    public updateWaktuPemetaanHutan: string;
}
@Object()
export class PemetaanHutanResponse {
    @Property()
    public IdTransaksiBlockchain: string;
    
    @Property()
    public idHutan: string;
 
    @Property()
    public namaHutan: string;

    @Property()
    public longitude: string;

    @Property()
    public latitude: string;
    
    @Property()
    public luasHutan: string;
    
    @Property()
    public nipSurveyor: string;

    @Property()
    public namaSurveyor: string;

    @Property()
    public waktuPemetaanHutan: string;

    @Property()
    public updateWaktuPemetaanHutan: string;
}