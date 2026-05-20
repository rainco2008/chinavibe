'use client'
// 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import * as echarts from 'echarts'
const App: React.FC = () => {
  const [activePackage, setActivePackage] = useState<number | null>(null)
  // 初始化图表
  useEffect(() => {
    const chartDom = document.getElementById('chart')
    if (chartDom) {
      const myChart = echarts.init(chartDom as HTMLElement)
      const option = {
        animation: false,
        title: {
          text: '游客满意度统计',
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'horizontal',
          bottom: 10,
        },
        series: [
          {
            name: '满意度',
            type: 'pie',
            radius: ['40%', '70%'],
            data: [
              { value: 65, name: '非常满意' },
              { value: 25, name: '满意' },
              { value: 7, name: '一般' },
              { value: 3, name: '不满意' },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      }
      myChart.setOption(option)
    }
    return () => {
      if (chartDom) {
        echarts.dispose(chartDom as HTMLElement)
      }
    }
  }, [])
  // 轮播图模块
  const swiperModules = [Pagination, Navigation, Autoplay]
  // 评价数据
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Chen',
      location: '上海',
      rating: 5,
      comment: '这次布罗莫山之旅让我终生难忘，日出的美景超乎想象，导游服务非常专业！',
    },
    {
      id: 2,
      name: 'Michael Wang',
      location: '北京',
      rating: 5,
      comment: '冒险路线设计得很棒，火山徒步体验独特，摄影师跟拍让回忆更加珍贵。',
    },
    {
      id: 3,
      name: 'Emma Liu',
      location: '广州',
      rating: 4,
      comment: '夜晚观星活动非常震撼，银河清晰可见，只是天气有些凉，建议多带衣物。',
    },
    {
      id: 4,
      name: 'David Zhang',
      location: '深圳',
      comment: '私人定制服务很棒，全程无购物，纯粹享受自然风光，值得推荐！',
      rating: 5,
    },
    {
      id: 5,
      name: 'Lucy Huang',
      location: '杭州',
      comment: '性价比很高的一次旅行，日出、火山、沙海三种体验一次满足。',
      rating: 4,
    },
  ]
  // 生成星级评价
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <i
            key={i}
            className={`fas fa-star ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
          ></i>
        ))}
      </div>
    )
  }
  return (
    <div className="pt-16 pb-24 ">
      {/* 图片展示区域 */}
      <section
        className=" pt-40 pb-40 relative -mt-[10.4rem] flex items-center justify-center text-white"
        style={{
          backgroundImage: `url('/images/section.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-7xl mx-auto demo-box">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#2B2B2B] mb-6">难忘的布罗莫之旅瞬间</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              体验令人惊叹的日出，探索壮丽的火山景观，创造难忘回忆
            </p>
          </div>
          <div className="relative">
            <div
              className="flex overflow-x-auto pb-8 scrollbar-hide space-x-6"
              id="gallery-container"
            >
              {[
                {
                  title: '山顶观日出',
                  image:
                    'https://static.mastergo.com/ai/img_res/1779157306490a3K9mP2xQ7vN4rT8wY.jpg',
                },
                {
                  title: '火山景观',
                  image:
                    'https://static.mastergo.com/ai/img_res/1779157306490b4L0nQ3xR8wS9yU1zA.jpg',
                },
                {
                  title: '越野车体验',
                  image:
                    'https://static.mastergo.com/ai/img_res/1779157306490c5M1oR4yT9xU0zV2aB.jpg',
                },
                {
                  title: '夕阳时光',
                  image:
                    'https://static.mastergo.com/ai/img_res/1779157306490d6N2pS5zU0yV1wW3bC.jpg',
                },
                {
                  title: '热气球飞行',
                  image:
                    'https://static.mastergo.com/ai/img_res/1779157306490e7O3qT6aV1zW2xY4cD.jpg',
                },
                {
                  title: '星空摄影',
                  image:
                    'https://static.mastergo.com/ai/img_res/1779157306490f8P4rU7bW2aX3yZ5dE.jpg',
                },
                {
                  title: '山顶观日出',
                  image:
                    'https://static.mastergo.com/ai/img_res/1779157306490a3K9mP2xQ7vN4rT8wY.jpg',
                },
                {
                  title: '火山景观',
                  image:
                    'https://static.mastergo.com/ai/img_res/1779157306490b4L0nQ3xR8wS9yU1zA.jpg',
                },
                {
                  title: '越野车体验',
                  image:
                    'https://static.mastergo.com/ai/img_res/1779157306490c5M1oR4yT9xU0zV2aB.jpg',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-80 transform transition-transform duration-300 hover:scale-105"
                  style={{ marginTop: index % 2 === 0 ? '0' : '20px' }}
                >
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-[#2B2B2B]">{item.title}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* 顶部轮播图区域 */}
      <section
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url('https://static.mastergo.com/ai/img_res/1779158106565a3K9mP2xQ7vN4rT8wY.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Swiper
          modules={swiperModules}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 3000 }}
          pagination={{ clickable: true }}
          navigation
          loop
          className="w-full h-full"
        >
          {[
            {
              title: '难忘的布罗莫山日出体验',
              subtitle:
                '体验令人惊叹的日出，探索壮丽的风景，在印度尼西亚最具标志性的目的地之一创造难忘回忆。',
              image: 'https://static.mastergo.com/ai/img_res/1779156472240P8kR3mN6wQ9vL2xZ4yA.jpg',
            },
            {
              title: '布罗莫山中心地带的难忘时刻',
              subtitle:
                '在布罗莫山体验令人惊叹的日出，探索美丽的风景，并在此留下难忘的记忆。这里不仅有壮丽的火山景观，还有丰富的文化和自然历史等待您的发现。',
              image: 'https://static.mastergo.com/ai/img_res/1779156472240Q9lS4nO7xR0wM3yB.jpg',
            },
            {
              title: '专业摄影与徒步体验',
              subtitle:
                '专业摄影师全程跟拍，经验丰富的当地向导带领，舒适的交通接送服务，精选住宿体验。',
              image: 'https://static.mastergo.com/ai/img_res/1779156472240R0tU5pQ8yS1xN4zC.jpg',
            },
          ].map((slide, index) => (
            <SwiperSlide key={index}>
              <div
                className="w-full h-full relative"
                style={{
                  backgroundImage: `url('${slide.image}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="relative z-10 text-center text-white max-w-3xl px-4 flex flex-col items-center justify-center h-full">
                  <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
                    {slide.subtitle}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="!rounded-button whitespace-nowrap bg-[#E63946] text-white px-8 py-3 text-lg hover:bg-[#d92f3d] transition-colors">
                      立即预订
                    </button>
                    <button className="!rounded-button whitespace-nowrap border-2 border-white text-white px-8 py-3 text-lg hover:bg-white/10 transition-colors">
                      了解更多
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
      {/* 探险套餐区域 */}
      <section className="py-20 bg-white px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#2B2B2B] mb-6">发现最适合您的布罗莫探险之旅</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              我们提供多种精心策划的四人包团，适合各种类型的旅行者，
              无论是日出观赏、火山徒步还是夜间摄影。
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: '日出探索者',
                description: '在布罗莫山顶欣赏最壮观的日出',
                price: '$39/人',
                image: 'https://static.mastergo.com/ai/img_res/1779156472240U3xY8sT1bV4aQ7cF.jpg',
              },
              {
                title: '冒险之路',
                description: '穿越火山地貌的徒步探险',
                price: '$69/人',
                image: 'https://static.mastergo.com/ai/img_res/1779156472240V4yZ9tU2cW5bR8dG.jpg',
              },
              {
                title: '夜空逃离',
                description: '在星空下度过难忘夜晚',
                price: '$109/人',
                image: 'https://static.mastergo.com/ai/img_res/1779156472240W5zA0uV3dX6cS9eH.jpg',
              },
              {
                title: '私人布罗莫之旅',
                description: '专属定制的奢华体验',
                price: '$149/人',
                image: 'https://static.mastergo.com/ai/img_res/1779156472240X6aB1vW4eY7dT0fI.jpg',
              },
            ].map((packageItem, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
                  activePackage === index ? 'ring-2 ring-[#E63946]' : 'hover:shadow-xl'
                }`}
                onMouseEnter={() => setActivePackage(index)}
                onMouseLeave={() => setActivePackage(null)}
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={packageItem.image}
                    alt={packageItem.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#2B2B2B] mb-2">{packageItem.title}</h3>
                  <p className="text-gray-600 mb-4">{packageItem.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-[#E63946]">{packageItem.price}</span>
                  </div>
                  <button className="!rounded-button whitespace-nowrap w-full border-2 border-[#E63946] text-[#E63946] py-2 hover:bg-[#E63946] hover:text-white transition-colors">
                    立即预订
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* 客户评价区域 */}
      <section className="py-20 bg-[#F9F7F2] px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#2B2B2B] mb-6">捕捉您的布罗莫之旅永恒瞬间</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              我们提供专业的照片和视频记录服务，帮助您永久保存旅行记忆
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">{renderStars(testimonial.rating)}</div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.comment}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 border-2 border-[#F4C430]"></div>
                  <div>
                    <h4 className="font-semibold text-[#2B2B2B]">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-16 bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-center text-[#2B2B2B] mb-8">游客满意度统计</h3>
            <div id="chart" style={{ height: '400px' }}></div>
          </div>
        </div>
      </section>
      {/* 预订流程区域 */}
      <section className="py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#2B2B2B] mb-6">如何预订您的旅程</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              四个简单的步骤，开启您的布罗莫山探险之旅
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex justify-center">
              <img
                src="https://static.mastergo.com/ai/img_res/1779156472240Y7bC2wX5fZ8eU1gJ.jpg"
                alt="布罗莫山旅行者"
                className="rounded-lg shadow-lg max-w-full h-auto"
              />
            </div>
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-[#E63946] text-white rounded-full flex items-center justify-center text-xl font-bold mr-4 flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#2B2B2B] mb-2">选择套餐</h3>
                  <p className="text-gray-700">
                    浏览我们的多种旅游套餐，选择最适合您兴趣和预算的选项。
                    每个套餐都经过精心设计，确保您能体验到布罗莫山的精华。
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-12 h-12 bg-[#E63946] text-white rounded-full flex items-center justify-center text-xl font-bold mr-4 flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#2B2B2B] mb-2">检查可用性</h3>
                  <p className="text-gray-700">
                    查看您选择日期的可用性，确认行程安排。我们建议提前预订以确保最佳体验时间。
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-12 h-12 bg-[#E63946] text-white rounded-full flex items-center justify-center text-xl font-bold mr-4 flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#2B2B2B] mb-2">进行预订</h3>
                  <p className="text-gray-700">
                    完成在线预订，支付定金确保您的位置。我们的客服团队将与您确认所有细节。
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-12 h-12 bg-[#E63946] text-white rounded-full flex items-center justify-center text-xl font-bold mr-4 flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#2B2B2B] mb-2">享受体验</h3>
                  <p className="text-gray-700">
                    抵达后尽情享受旅行，创造难忘的回忆。我们的专业团队将全程陪伴您。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 底部行动号召区域 */}
      <section
        className="relative py-32 flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url('https://static.mastergo.com/ai/img_res/1779156472240Z8cD3xY6gA9fV2hK.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center text-white max-w-4xl px-4">
          <h2 className="text-5xl font-bold mb-6">今天就体验布罗莫山的魔力</h2>
          <p className="text-xl mb-8 opacity-90">
            发现令人叹为观止的景色，迎接欢迎的风景，
            在印度尼西亚最具标志性的目的地之一创造难忘时刻。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="!rounded-button whitespace-nowrap bg-[#E63946] text-white px-8 py-3 text-lg hover:bg-[#d92f3d] transition-colors">
              立即预订
            </button>
            <button className="!rounded-button whitespace-nowrap border-2 border-white text-white px-8 py-3 text-lg hover:bg-white/10 transition-colors">
              联系我们
            </button>
          </div>
        </div>
      </section>
      {/* 页脚 */}
      <footer className="bg-[#2B2B2B] text-white py-12 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">MountBromo</h3>
              <p className="text-gray-400">
                专业的布罗莫山旅游服务提供商，致力于为您带来难忘的印尼探险之旅。
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">快速链接</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    首页
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    套餐
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    相册
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    联系我们
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">联系方式</h4>
              <ul className="space-y-2 text-gray-400">
                <li>电话: +62 123 4567</li>
                <li>邮箱: info@mountbromo.com</li>
                <li>地址: 印度尼西亚东爪哇省</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">关注我们</h4>
              <div className="flex space-x-4">
                {['fab fa-facebook', 'fab fa-instagram', 'fab fa-twitter', 'fab fa-youtube'].map(
                  (icon, index) => (
                    <a
                      key={index}
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <i className={icon}></i>
                    </a>
                  ),
                )}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MountBromo. 保留所有权利。</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
export default App
