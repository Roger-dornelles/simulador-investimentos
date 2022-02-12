/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import './index.css';

import {Graphics} from './components/Graphics'

import api from './api';

//mascara formatar numeros
import { mask,unMask } from "remask"

// icons
import { FaArrowLeft,FaArrowRight,FaHome,FaTimes, FaSistrix,FaCheck } from "react-icons/fa";


const App = ()=>{
  //formato de valor somente numeros (campos input formulario)
  const patternAporte = ['9,99','99,99','999,99','9.999,99','99.999,99','999.999,99'];
  const patternMonth = ['99999'];
  // ----------------------------------------------------------------------------------
  const [ valueInitial, setValueInitial  ] = useState('');
  const [ month , setMonth ] = useState('');
  const [ monthlyContribution, setMonthlyContribution] = useState('');
  const [ profitability, setProfitability] = useState('');
  const [ipca, setIpca ] = useState(0);
  const [ cdi, setCdi ] = useState(0);

  const [optionIndexing, setOptionIndexing] = useState('');
  const [optionYields, setOptionYields] = useState('');

  const [ viewSimulators, setViewSimulators] = useState('');
  
  const [cAporte, setCAporte] = useState('');
  const [sAporte, setSAporte ] = useState('');
  
  const [buttonGross,setButtonGross] = useState(false);
  const [ buttonLiquid, setButtonLiquid] = useState(false);
  const [ buttonPos, setButtonPos ] = useState(false);
  const [ buttonPre, setButtonPre ] = useState(false);
  const [ buttonFixed, setButtonFixed ] = useState(false);
  const [ buttonSimulation, setButtonSimulation ] = useState(false);
  const [ error, setError] = useState(false);
  const [ warning, setWarning] = useState('');
  
  const [optionsGrossLiquid, setOptionsGrossLiquid ] = useState('');
  const [ optionsPrePosFixado, setOptionsPrePosFixado ] = useState('');
  const [ validateForm, setValidateForm ] = useState(false);

  useEffect(()=>{
    const apiFull = async()=>{
      try{

        let json = await api.getIndicators();
        setCdi(json[0].valor);
        setIpca(json[1].valor);
      }catch(error){
        if(error){
          setWarning('Ocorreu um erro tente mais tarde.');
        }
      }

    }
    apiFull();
  },[]);

// validar/selecionar buttons rendimento
  const handleSubmit = (e) => {
    e.preventDefault();

    if(optionYields === 'Bruto'){
      setButtonLiquid(false);
      setButtonGross(true);
      setOptionsGrossLiquid('bruto');
    }

    if(optionYields === 'Liquido'){
      setButtonGross(false);
      setButtonLiquid(true);
      setOptionsGrossLiquid('liquido');
    }
  };
// -----------------------------------------------------
// validar/selecionar buttons indexação
  const handleSubmitForm = async(e)=>{
    e.preventDefault();

    if(optionIndexing !== ''){
      setError(false);
      if(optionIndexing === 'POS'){
        setButtonPre(false);
        setButtonFixed(false);
        setButtonPos(true);
        setOptionsPrePosFixado('pos');
      }
  
      if(optionIndexing === 'PRE'){
        setButtonPos(false);
        setButtonFixed(false);
        setButtonPre(true);
        setOptionsPrePosFixado('pre');
      }
  
      if(optionIndexing === 'FIXADO'){
        setButtonPre(false);
        setButtonPos(false);
        setButtonFixed(true);
        setOptionsPrePosFixado('ipca');
      }

    }else{
      setOptionIndexing('');
      setButtonSimulation(false);
    }

  }
// ----------------------------------------------------------------------------------

// validar formulario antes de fazer requisição BD
  const submitForm = async(e)=>{
    e.preventDefault();
    // validar se campos estão preenchidos
    if(valueInitial === ''){
      return setValidateForm(true);

    }else if(month === ''){
      return setValidateForm(true);

    }else if(monthlyContribution === ''){
      return setValidateForm(true);

    }else if(profitability === ''){
      return setValidateForm(true);
    }
//----------------------------------------------------------------------------------------
    //validar se rendimento/Indexação estao selecionados
    // se estiver selecionado fazer requisição ao BD
    if(optionsGrossLiquid && optionsPrePosFixado !== ''){
      setError(false);
      try{
        let json = await api.getSimulationAll(optionsGrossLiquid,optionsPrePosFixado);
        setViewSimulators(json);
        setButtonSimulation(true);

        for(let i in json){
          setCAporte(json[i].graficoValores.comAporte);
          setSAporte(json[i].graficoValores.semAporte);
        }

      }catch(error) {
        if(error){
          setWarning('Ocorreu um erro tente mais tarde.');
        }
      }

    }else{
      setError(true);
      setValidateForm(true);
      setButtonSimulation(false);
    }
  }
  // ----------------------------------------------------------------------------
  // limpar campos 
  const handleClearFields = ()=>{
    setValueInitial('');
    setMonth('');
    setMonthlyContribution('');
    setProfitability('');
  }

  // -----------------------------------------------------------------------------
  return(
    <>
      <header>
        <span>Calculadora de Investimentos</span>
        <div className="menu-search">
          <div className="icons">
              <FaArrowLeft />
              <FaArrowRight />
              <FaTimes />
              <FaHome />
          </div>
          <div className="search-input">
            <input type="text" />
            <div>
              <FaSistrix />
              <input type="text" />
            </div>
          </div>
        </div>
            
      </header>
      <section className='section'>
        <h2>Simulador de Investimentos</h2>
        <div className="simulator">

          {error && <span style={{color:'#f51108'}} className="error">Selecionar o tipo de Rendimento e/ou Indexação</span>}
          
          { /* ----------------- campos do formulario ------------------------------------------ */ }
          <div className="simulator-one">
            <div className="forms">
            <form onSubmit={handleSubmit}>
              <div className="description-one">

                <h3>Simulador</h3>
                <p style={{color:'#000'}}>Rendimento</p>
                  <div className="buttons-description">
                    {buttonGross  ? <button value='Bruto' onClick={e=>setOptionYields(e.target.value)} style={{backgroundColor:'#ED8E53',color:'#fff'}}><FaCheck />Bruto</button> : <button value='Bruto' onClick={e=>setOptionYields(e.target.value)} >Bruto</button> }
                    {buttonLiquid  ? <button value='Liquido'  onClick={e=>setOptionYields(e.target.value)} style={{backgroundColor:'#ED8E53',color:'#fff'}}><FaCheck />Liquido</button> :<button value='Liquido' onClick={e=>setOptionYields(e.target.value)} >Liquido</button>}
                  </div>

                    {validateForm && valueInitial.length === 0 ?
                      <label style={{color:'#f50808'}}>
                        Aporte inicial
                        <input type="text" style={{borderBottom:'1px solid #f50808'}} value={valueInitial} onChange={e=>setValueInitial(mask(unMask(e.target.value),patternAporte))} />
                        <span style={{color:'#f50808',fontSize:'13px'}}>Aporte deve ser um numero Ex: 1.000,00</span>
                      </label>
                    :
                      <label>
                        Aporte inicial
                        <input type="text" value={valueInitial} onChange={e=>setValueInitial(mask(unMask(e.target.value),patternAporte))} />
                      </label>
                    
                    }
                    
                    {validateForm && month.length === 0 ?
                      <label style={{color:'#f50808'}}>
                        Prazo (em meses)
                        <input type="text" style={{borderBottom:'1px solid #f50808'}} value={month} onChange={e=>setMonth(e.target.value)} />
                        <span style={{color:'#f50808',fontSize:'13px'}}>Prazo deve ser um numero  Ex: 6</span>
                      </label>
                    :
                      <label>
                        Prazo (em meses)
                        <input type="text" value={month} onChange={e=>setMonth(mask(unMask(e.target.value),patternMonth))} />
                      </label>
                    }
                    {ipca ?
                      <label>
                      IPCA (ao ano)
                        <input type="text" value={`${ipca}%`} onChange={e=>setIpca(e.target.value)} />
                      </label>
                    :
                      <label>
                        IPCA (ao ano)
                        <input type="text" value={`${ipca}%`} onChange={e=>setIpca(e.target.value)} />
                      </label>
                    
                    }
                
              </div>
            </form>
            <form onSubmit={handleSubmitForm}>
                <div className="description-two">

                  <p style={{color:'#000'}}>Tipos de Indexação</p>
                  <div className="buttons-description-two">
                    {buttonPre ? <button value='PRE' onClick={e=>setOptionIndexing(e.target.value)} style={{backgroundColor:'#ED8E53',color:'#fff'}}><FaCheck />PRÈ</button> : <button value='PRE'onClick={e=>setOptionIndexing(e.target.value)} >PRÉ</button>}
                    {buttonPos ? <button value='POS' onClick={e=>setOptionIndexing(e.target.value)} style={{backgroundColor:'#ED8E53',color:'#fff'}}><FaCheck />POS</button> : <button value='POS' onClick={e=>setOptionIndexing(e.target.value)} >POS</button>}
                    {buttonFixed ? <button value='FIXADO' onClick={e=>setOptionIndexing(e.target.value)} style={{backgroundColor:'#ED8E53',color:'#fff'}}><FaCheck />FIXADO</button> : <button value='FIXADO' onClick={e=>setOptionIndexing(e.target.value)} >FIXADO</button>}
                  </div>

                    {validateForm && monthlyContribution.length === 0 ?
                      <label style={{color:'#f50808'}}>
                        Aporte Mensal
                        <input type="text" style={{borderBottom:'1px solid #f50808'}} value={monthlyContribution} onChange={e=>setMonthlyContribution(mask(unMask(e.target.value),patternAporte))} />
                        <span style={{color:'#f50808',fontSize:'13px'}}>Aporte deve ser um numero Ex: 500,00</span>
                      </label>
                    :
                      <label>
                        Aporte Mensal
                        <input type="text" value={monthlyContribution} onChange={e=>setMonthlyContribution(mask(unMask(e.target.value),patternAporte))} />
                      </label>
                    }

                    {validateForm && profitability.length === 0 ?
                      <label style={{color:'#f50808'}}>
                        Rentabilidade
                        <input type="text" style={{borderBottom:'1px solid #f50808'}} value={profitability} onChange={e=>setProfitability(e.target.value)} />
                        <span style={{color:'#f50808',fontSize:'13px'}}>Rentabilidade deve ser um numero  Ex: 10</span>
                      </label>
                    :
                      <label>
                        Rentabilidade
                        <input type="text" value={profitability} onChange={e=>setProfitability(e.target.value)} />
                        
                      </label>
                    }

                    {cdi ?
                      <label>
                        CDI (ao ano)
                        <input type="text" value={`${cdi}%`} onChange={e=>setCdi(e.target.value)} />
                      </label>
                    :
                      <label>
                        CDI (ao ano)
                        <input type="text" value={`${cdi}%`} onChange={e=>setCdi(e.target.value)}  />
                      </label>
                    }
                    

                </div>
            </form>
            </div>
            <div className="buttons">
                <button onClick={handleClearFields}>
                  limpar Campos
                </button>
                {buttonSimulation ? <button style={{background:'#ED8E53'}} onClick={submitForm}>Simular</button> : <button style={{background:'#757575'}} onClick={submitForm} >Simular</button> }
              </div>
          </div>
          { /* ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */ }
          { /* ----------------------------------- campos da simulação -------------------------------------------------------- */ }
          <div className="simulator-two">

            {viewSimulators && viewSimulators.map((item,index)=>{
              return (
                <div key={index} className="container">
                  <div className="itens" >
                    <h3>Resultado da simulação.</h3>
                    <div className="container-itens">
                      <div className="itens-description" >
                        <b>Valor final Bruto</b>
                        <span>R$ {item.valorFinalBruto}</span>
                      </div>

                      <div className="itens-description">
                        <b>Alíquota do IR</b>
                        <span>{item.aliquotaIR}%</span>
                      </div>

                      <div className="itens-description">
                        <b>Valor Pago em IR</b>
                        <span>R$ {item.valorPagoIR}</span>
                      </div>

                      <div className="itens-description">
                        <b>Valor Final Liquido.</b>
                        <span style={{color:'#54AA46'}}>R$ {item.valorFinalLiquido}</span>
                      </div>

                      <div className="itens-description">
                        <b>Valor Total Investido.</b>
                        <span>R$ {item.valorTotalInvestido}</span>
                      </div>

                      <div className="itens-description">
                        <b>Ganho Liquido.</b>
                        <span style={{color:'#54AA46'}}>R$ {item.ganhoLiquido}</span>
                      </div>

                    </div>
                  </div>
                  <div className="graphic">

                  <Graphics cAporte={cAporte} sAporte={sAporte} />
                  </div>
                </div>
              )
            })}

          </div>
        </div>
      </section>
    </>
  )
}

export default App;