import { Card, Image, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import LoadingPage from 'system/LoadingPage';
import apiRequest from 'utils/api';

const RodLaverPreview: React.FC = () => {

  const [section, setSection] = useState('GA');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [seatCount, setSeatCount] = useState([]);

  const previewSection = (section: string) => {
    setSection(section)
    setVisible(true)
  }

  useEffect(() => {
    const getVenues = async () => {
      setLoading(true)
      const res = await apiRequest('GET', '/venue')
      if (res.ok) {
        const v = (res.venues.filter(((v: { name: string; }) => (v.name === 'Rod Laver Arena'))))
        if (v.length > 0) {
          setSeatCount(() => {
            return v[0].sections.map((s: { totalSeats: number; }) => s.totalSeats);
          })
        }
      }
      setLoading(false)
    }
    getVenues();
  }, [])

  if (loading) {
    return <LoadingPage />
  } else {
    return (
      <Card bordered={true} className='flex justify-center items-center text-center w-full shadow-sm flex-col'>
        <Image
          width={200}
          style={{ display: 'none' }}
          preview={{
            visible,
            src: require(`../../../../assets/RodLaverArena/RLA-${section}.jpg`),
            onVisibleChange: (value) => {
              setVisible(value);
            },
          }}
        />
        <span>
          <p className='text-h4 md:text-h4-md'>Rod Laver Arena</p>
          <p className='text-h6 md:text-h6-md italic'>Click on a section to preview seating position. Hover for section seating capacity.</p>
        </span>
        <br></br>
        <div className='flex flex-row justify-center'>
        <svg
            viewBox='0 0 164.34229 153.53323'
            className='w-[150px] md:w-[250px]'
            version="1.1"
            id="svg1304"
          >
  
            <path
              fill="#52B69A"
              stroke="#168AAD"
              d="m 60.020105,128.52121 h 42.763625 l 0.0289,24.44668 -42.821343,0.0249 0.115421,-23.92442 z"
              stroke-width="1"
              fill-opacity="0.498039"
              className="venue-stage"
            />
            <Tooltip title={`Seats = ${seatCount[8]}`} placement='leftBottom'>
              <path
                fill="none"
                stroke="#168AAD"
                d="M 21.548527,93.803465 22.055711,132.0912 1.5654325,132.84811 0.65249854,109.52978 0.55106354,93.803465 Z"
                stroke-width="1"
                onClick={() => previewSection('8')}
                className="venue-8 venue-section hover:fill-[#d7feffb2] hover:cursor-pointer"
              />
            </Tooltip>
            <Tooltip title={`Seats = ${seatCount[1]}`} placement='bottomRight'>
              <path
                fill="none"
                stroke="#168AAD"
                d="m 53.846368,101.49625 0.309936,23.70962 -26.453744,5.97609 -0.0825,-13.99658 v -15.9166 z"
                stroke-width="1"
                onClick={() => previewSection('1')}
                className="venue-1 venue-section hover:fill-[#d7feffb2] hover:cursor-pointer"
              />
            </Tooltip>
            <Tooltip title={`Seats = ${seatCount[0]}`} placement='bottom'>
              <path
                fill="none"
                stroke="#168AAD"
                d="m 60.173045,124.70882 42.599685,0.0222 0.0244,-55.456545 -42.624095,-0.33261 z"
                stroke-width="1"
                fill-opacity="0.5"
                onClick={() => previewSection('GA')}
                className="venue-ga venue-section hover:fill-[#d7feffb2] hover:cursor-pointer"
              />
            </Tooltip>
            <Tooltip title={`Seats = ${seatCount[11]}`} placement='topRight'>
              <path
                fill="none"
                stroke="#168AAD"
                d="M 81.213908,22.024418 65.794955,22.857367 51.160746,26.283745 42.771988,6.655529 53.968041,3.105375 69.252917,0.95833862 81.186995,0.51873327 Z"
                stroke-width="1"
                data-active="1"
                stroke-opacity="1"
                onClick={() => previewSection('11')}
                className="venue-11 venue-section hover:fill-[#d7feffb2] hover:cursor-pointer"
              />
            </Tooltip>
            <Tooltip title={`Seats = ${seatCount[10]}`} placement='leftTop'>
              <path
                fill="none"
                stroke="#168AAD"
                d="m 48.668223,27.588795 -9.760088,4.700291 -9.275374,8.820619 -3.779403,9.008307 L 6.5670906,41.691404 12.05469,29.099492 19.834286,19.968878 30.308801,13.118742 40.323031,7.6264619 Z"
                stroke-width="1"
                data-active="1"
                stroke-opacity="1"
                onClick={() => previewSection('10')}
                className="venue-10 venue-section hover:fill-[#d7feffb2] hover:cursor-pointer"
              />
            </Tooltip>
            <Tooltip title={`Seats = ${seatCount[9]}`} placement='left'>
              <path
                fill="none"
                stroke="#168AAD"
                d="M 25.072812,52.641533 22.356718,64.924421 21.208121,77.880759 21.525721,90.33829 0.50221516,90.10043 0.58030255,72.634657 1.4976409,56.44388 5.1486614,43.875005 Z"
                stroke-width="1"
                data-active="1"
                stroke-opacity="1"
                onClick={() => previewSection('9')}
                className="venue-9 venue-section hover:fill-[#d7feffb2] hover:cursor-pointer"
              />
            </Tooltip>
            <Tooltip title={`Seats = ${seatCount[3]}`} placement='rightBottom'>
              <path
                fill="none"
                stroke="#168AAD"
                d="m 57.07469,59.423955 -2.670967,4.83031 -26.44864,-4.76438 2.32232,-6.143553 2.838391,-5.642037 5.67678,-6.770443 6.063836,-4.889761 4.475653,-3.233845 4.566404,-1.247363 8.713796,24.871428 z"
                stroke-width="1"
                data-active="1"
                stroke-opacity="1"
                onClick={() => previewSection('3')}
                className="venue-3 venue-section hover:fill-[#d7feffb2] hover:cursor-pointer"
              />
            </Tooltip>
            <Tooltip title={`Seats = ${seatCount[2]}`} placement='rightBottom'>
              <path
                fill="none"
                stroke="#168AAD"
                d="m 53.955854,67.978755 v 29.81492 l -26.390616,0.25965 0.225133,-35.7452 z"
                stroke-width="1"
                data-active="1"
                stroke-opacity="1"
                onClick={() => previewSection('2')}
                className="venue-2 venue-section hover:fill-[#d7feffb2] hover:cursor-pointer"
              />
            </Tooltip>
            <Tooltip title={`Seats = ${seatCount[7]}`} placement='bottomLeft'>
              <path
                fill="none"
                stroke="#168AAD"
                d="m 108.93105,101.28183 -0.30994,23.70962 25.90742,6.24925 0.62882,-14.26974 v -15.9166 z"
                stroke-width="1"
                onClick={() => previewSection('7')}
                className="venue-7 venue-section hover:fill-[#d7feffb2] hover:cursor-pointer"
              />
            </Tooltip>
            <Tooltip title={`Seats = ${seatCount[5]}`} placement='leftBottom'>
              <path
                fill="none"
                stroke="#168AAD"
                d="m 105.70273,59.209535 2.67096,4.83031 26.44864,-4.76438 -2.32232,-6.143556 -2.83839,-5.64204 -5.67678,-6.77044 -6.06383,-4.889761 -4.47566,-3.233845 -4.5664,-1.247363 -8.7138,24.871429 z"
                stroke-width="1"
                data-active="1"
                stroke-opacity="1"
                onClick={() => previewSection('5')}
                className="venue-5 venue-section hover:fill-[#d7feffb2] hover:cursor-pointer"
              />
            </Tooltip>
            <Tooltip title={`Seats = ${seatCount[6]}`} placement='leftBottom'>
              <path
                fill="none"
                stroke="#168AAD"
                d="m 108.82156,67.764335 v 29.81492 l 26.39062,0.25965 -0.22513,-35.7452 z"
                stroke-width="1"
                data-active="1"
                stroke-opacity="1"
                onClick={() => previewSection('6')}
                className="venue-6 venue-section hover:fill-[#d7feffb2] hover:cursor-pointer"
              />
            </Tooltip>
            <Tooltip title={`Seats = ${seatCount[4]}`} placement='bottom'>
              <path
                fill="none"
                stroke="#168AAD"
                d="M 64.754271,55.98113 98.128243,55.501859 106.49111,31.008955 82.047416,28.625452 56.307384,31.198198 Z"
                stroke-width="1"
                data-active="1"
                stroke-opacity="1"
                onClick={() => previewSection('4')}
                className="venue-4 venue-section hover:fill-[#d7feffb2] hover:cursor-pointer"
              />
            </Tooltip>
            <Tooltip title={`Seats = ${seatCount[15]}`} placement='rightBottom'>
              <path
                fill="none"
                stroke="#168AAD"
                d="m 142.79376,94.052325 -0.50719,38.287735 20.49028,0.75691 0.91294,-23.31833 0.10143,-15.726315 z"
                stroke-width="1"
                onClick={() => previewSection('15')}
                className="venue-15 venue-section hover:fill-[#d7feffb2] hover:cursor-pointer"
              />
            </Tooltip>
            <Tooltip title={`Seats = ${seatCount[12]}`} placement='topLeft'>
              <path
                fill="none"
                stroke="#168AAD"
                d="M 83.128377,22.273279 98.54733,23.106228 113.18154,26.532606 121.5703,6.9043903 110.37424,3.3542353 95.08937,1.2071993 83.155287,0.76759432 Z"
                stroke-width="1"
                data-active="1"
                stroke-opacity="1"
                onClick={() => previewSection('12')}
                className="venue-12 venue-section hover:fill-[#d7feffb2] hover:cursor-pointer"
              />
            </Tooltip>
            <Tooltip title={`Seats = ${seatCount[13]}`} placement='rightTop'>
              <path
                fill="none"
                stroke="#168AAD"
                d="m 115.67406,27.837656 9.76009,4.700291 9.27537,8.820619 3.77941,9.008307 19.28626,-8.426608 -5.4876,-12.591912 -7.77959,-9.130614 -10.47452,-6.850136 -10.01423,-5.4922797 z"
                stroke-width="1"
                data-active="1"
                stroke-opacity="1"
                onClick={() => previewSection('13')}
                className="venue-13 venue-section hover:fill-[#d7feffb2] hover:cursor-pointer"
              />
            </Tooltip>
            <Tooltip title={`Seats = ${seatCount[14]}`} placement='right'>
              <path
                fill="none"
                stroke="#168AAD"
                d="m 139.26947,52.890393 2.7161,12.282892 1.14859,12.95633 -0.3176,12.45753 21.02351,-0.23785 -0.0781,-17.46578 -0.91734,-16.190774 -3.65102,-12.568875 z"
                stroke-width="1"
                data-active="1"
                stroke-opacity="1"
                onClick={() => previewSection('14')}
                className="venue-14 venue-section hover:fill-[#d7feffb2] hover:cursor-pointer"
              />
            </Tooltip>
            <text
              x="40.897564"
              y="118.41155"
              text-anchor="middle"
              font-family="Poppins"
              font-size="10px"
              stroke="none"
              fill="#000000"
              pointer-events="none"
              id="text1150"><tspan
                id="tspan1148">1</tspan></text>
            <text
              x="81.395065"
              y="94.999367"
              text-anchor="middle"
              font-family="Poppins"
              font-size="10px"
              stroke="none"
              fill="#000000"
              pointer-events="none"
              id="text1178"><tspan
                dy="2.8287947"
                id="tspan1176">GA</tspan></text>
            <text
              x="81.756912"
              y="143.29063"
              text-anchor="middle"
              font-family="Poppins"
              font-size="10px"
              stroke="none"
              fill="#000000"
              pointer-events="none"
              id="text1178-0"><tspan
                id="tspan1176-1">STAGE</tspan></text>
            <text
              x="45.830536"
              y="52.998768"
              text-anchor="middle"
              font-family="Poppins"
              font-size="10px"
              stroke="none"
              fill="#000000"
              pointer-events="none"
              id="text1266"><tspan
                id="tspan1264">3</tspan></text>
            <text
              x="82.202492"
              y="44.979519"
              text-anchor="middle"
              font-family="Poppins"
              font-size="10px"
              stroke="none"
              fill="#000000"
              pointer-events="none"
              id="text1266-1"><tspan
                id="tspan1264-3">4</tspan></text>
            <text
              x="115.42822"
              y="53.223499"
              text-anchor="middle"
              font-family="Poppins"
              font-size="10px"
              stroke="none"
              fill="#000000"
              pointer-events="none"
              id="text1266-1-4"><tspan
                id="tspan1264-3-8">5</tspan></text>
            <text
              x="121.87341"
              y="84.147362"
              text-anchor="middle"
              font-family="Poppins"
              font-size="10px"
              stroke="none"
              fill="#000000"
              pointer-events="none"
              id="text1266-1-4-7"><tspan
                id="tspan1264-3-8-9">6</tspan></text>
            <text
              x="121.90103"
              y="117.42142"
              text-anchor="middle"
              font-family="Poppins"
              font-size="10px"
              stroke="none"
              fill="#000000"
              pointer-events="none"
              id="text1266-1-4-7-0"><tspan
                id="tspan1264-3-8-9-4">7</tspan></text>
            <text
              x="40.803638"
              y="84.90757"
              text-anchor="middle"
              font-family="Poppins"
              font-size="10px"
              stroke="none"
              fill="#000000"
              pointer-events="none"
              id="text1270"><tspan
                id="tspan1268">2</tspan></text>
            <text
              x="80.868011"
              y="42.527439"
              text-anchor="middle"
              font-family="Poppins"
              font-size="10px"
              stroke="none"
              fill="#000000"
              pointer-events="none"
              id="text1302"><tspan
                id="tspan1300" /></text>
            <text
              x="11.753327"
              y="115.38581"
              text-anchor="middle"
              font-family="Poppins"
              font-size="10px"
              stroke="none"
              fill="#000000"
              pointer-events="none"
              id="text1150-1"><tspan
                id="tspan1148-5">8</tspan></text>
            <text
              x="11.222732"
              y="71.67131"
              text-anchor="middle"
              font-family="Poppins"
              font-size="10px"
              stroke="none"
              fill="#000000"
              pointer-events="none"
              id="text1150-1-4"><tspan
                id="tspan1148-5-1">9</tspan></text>
            <text
              x="27.339273"
              y="30.697054"
              text-anchor="middle"
              font-family="Poppins"
              font-size="10px"
              stroke="none"
              fill="#000000"
              pointer-events="none"
              id="text1150-1-4-8"><tspan
                id="tspan1148-5-1-8">10</tspan></text>
            <text
              x="64.216103"
              y="14.580511"
              text-anchor="middle"
              font-family="Poppins"
              font-size="10px"
              stroke="none"
              fill="#000000"
              pointer-events="none"
              id="text1150-1-4-3"><tspan
                id="tspan1148-5-1-5">11</tspan></text>
            <text
              x="101.08437"
              y="15.469419"
              text-anchor="middle"
              font-family="Poppins"
              font-size="10px"
              stroke="none"
              fill="#000000"
              pointer-events="none"
              id="text1150-1-4-3-2"><tspan
                id="tspan1148-5-1-5-7">12</tspan></text>
            <text
              x="136.26401"
              y="32.818813"
              text-anchor="middle"
              font-family="Poppins"
              font-size="10px"
              stroke="none"
              fill="#000000"
              pointer-events="none"
              id="text1150-1-4-3-1"><tspan
                id="tspan1148-5-1-5-5">13</tspan></text>
            <text
              x="153.05725"
              y="73.594597"
              text-anchor="middle"
              font-family="Poppins"
              font-size="10px"
              stroke="none"
              fill="#000000"
              pointer-events="none"
              id="text1150-1-4-3-1-2"><tspan
                id="tspan1148-5-1-5-5-1">14</tspan></text>
            <text
              x="152.94675"
              y="117.594"
              text-anchor="middle"
              font-family="Poppins"
              font-size="10px"
              stroke="none"
              fill="#000000"
              pointer-events="none"
              id="text1150-1-4-3-1-2-8"><tspan
                id="tspan1148-5-1-5-5-1-5">15</tspan></text>
            <text
              x="10.130084"
              y="71.285751"
              id="text1195"><tspan
                id="tspan1193"
                x="10.130084"
                y="71.285751"></tspan></text>
            <text
              x="95.141304"
              y="12.1341"
              id="text1411"><tspan
                id="tspan1409"
                x="95.141304"
                y="12.1341"></tspan></text>
          </svg>
        </div>
        <br></br>
      </Card>
    )
  }
};

export default RodLaverPreview;